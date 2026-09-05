import { NextRequest, NextResponse } from 'next/server';
import { initializeSubscription, type VendorTier } from '@/lib/paystack';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// This route runs on the server only — the secret key never reaches the browser.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const { tier, applicationId } = await req.json();
    const email = user.email;

    if (!email) {
      return NextResponse.json({ error: 'Your account does not have an email address.' }, { status: 400 });
    }
    if (tier !== 'standard' && tier !== 'featured') {
      return NextResponse.json({ error: 'tier must be "standard" or "featured".' }, { status: 400 });
    }
    if (!applicationId || typeof applicationId !== 'string') {
      return NextResponse.json({ error: 'An approved application is required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const application = await db.collection('vendorApplications').doc(applicationId).get();
    const applicationData = application.data();
    if (
      !application.exists ||
      applicationData?.submitterUid !== user.uid ||
      applicationData?.applicationStatus !== 'approved' ||
      applicationData?.selectedPlan !== tier
    ) {
      return NextResponse.json({ error: 'This application is not approved for the selected plan.' }, { status: 403 });
    }

    // Where PayStack sends the customer back after paying.
    const origin = req.nextUrl.origin;
    const callbackUrl = `${origin}/dashboard?paystack=return`;

    const result = await initializeSubscription({
      email,
      tier: tier as VendorTier,
      callbackUrl,
      metadata: { uid: user.uid, applicationId },
    });

    // Create the email-linked vendor record before payment. PayStack webhooks can
    // now activate it even if the browser callback is interrupted or fails.
    await db.collection('vendors').doc(user.uid).set({
      membershipStatus: 'pending_payment',
      membershipTier: tier,
      paystackReference: result.reference,
      email,
      submitterUid: user.uid,
      applicationId,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('PayStack initialize error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to start payment.' },
      { status: 500 }
    );
  }
}
