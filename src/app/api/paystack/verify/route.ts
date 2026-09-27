import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { TIER_AMOUNTS, disableSubscription, getCustomerSubscription, verifyTransaction, type VendorTier } from '@/lib/paystack';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

// Server only — confirms the payment with PayStack using the secret key.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const { reference } = await req.json();
    if (!reference || typeof reference !== 'string') {
      return NextResponse.json({ error: 'Missing reference.' }, { status: 400 });
    }

    const result = await verifyTransaction(reference);
    if (!result.success) return NextResponse.json(result);

    const tier = result.tier as VendorTier | undefined;
    const metadataUid = result.metadata?.uid;
    const applicationId = result.metadata?.applicationId;
    if (
      (tier !== 'standard' && tier !== 'featured') ||
      metadataUid !== user.uid ||
      result.customerEmail?.toLowerCase() !== user.email?.toLowerCase() ||
      result.amount !== TIER_AMOUNTS[tier] ||
      result.currency !== 'ZAR' ||
      typeof applicationId !== 'string'
    ) {
      return NextResponse.json({ error: 'Payment details do not match this membership.' }, { status: 403 });
    }

    const db = getAdminDb();
    const application = await db.collection('vendorApplications').doc(applicationId).get();
    const applicationData = application.data();
    if (
      !application.exists ||
      applicationData?.submitterUid !== user.uid ||
      applicationData?.applicationStatus !== 'approved'
    ) {
      return NextResponse.json({ error: 'The approved application could not be confirmed.' }, { status: 403 });
    }

    const previousSubscriptionCode = result.metadata?.previousSubscriptionCode;
    if (result.metadata?.changePlan && typeof previousSubscriptionCode === 'string') {
      const previous = await getCustomerSubscription(user.email!, previousSubscriptionCode);
      if (previous?.emailToken && previous.subscriptionCode !== result.reference) {
        await disableSubscription(previous.subscriptionCode, previous.emailToken);
      }
      await application.ref.update({ selectedPlan: tier, updatedAt: FieldValue.serverTimestamp() });
    }

    // Finalize on the server so the return is not lost while Firebase restores the
    // browser session, and so webhooks have an email-linked vendor record to update.
    await db.collection('vendors').doc(user.uid).set(
      {
        membershipStatus: 'active',
        listingStatus: 'active',
        membershipTier: tier,
        paystackReference: result.reference,
        email: user.email,
        submitterUid: user.uid,
        applicationId,
        lastPaymentAt: result.paidAt ? new Date(result.paidAt) : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('PayStack verify error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
