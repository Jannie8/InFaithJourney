import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSubscription, disableSubscription } from '@/lib/paystack';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

// Server only — cancels an active PayStack subscription when present, withdraws
// the application, and immediately removes the public vendor listing.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const { applicationId } = await req.json();
    const db = getAdminDb();
    const applicationRef = typeof applicationId === 'string'
      ? db.collection('vendorApplications').doc(applicationId)
      : null;
    const application = applicationRef ? await applicationRef.get() : null;
    if (!application?.exists || application.data()?.submitterUid !== user.uid) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    let subscriptionCode: string | null = null;
    const vendorRef = db.collection('vendors').doc(user.uid);
    const vendor = await vendorRef.get();
    if (vendor.data()?.membershipStatus === 'active' && user.email) {
      const sub = await getCustomerSubscription(user.email);
      if (sub?.status === 'active') {
        if (!sub.emailToken) {
          return NextResponse.json({ error: 'Please contact support to cancel this subscription.' }, { status: 409 });
        }
        await disableSubscription(sub.subscriptionCode, sub.emailToken);
        subscriptionCode = sub.subscriptionCode;
      }
    }

    const batch = db.batch();
    batch.update(applicationRef!, {
      applicationStatus: 'cancelled',
      previouslyApproved: application.data()?.applicationStatus === 'approved' || application.data()?.previouslyApproved === true,
      cancelledAt: FieldValue.serverTimestamp(),
    });
    batch.set(vendorRef, {
      listingStatus: 'inactive',
      membershipStatus: 'inactive',
      cancelledAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    await batch.commit();
    return NextResponse.json({ cancelled: true, subscriptionCode });
  } catch (err: any) {
    console.error('PayStack cancel error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to cancel subscription.' },
      { status: 500 }
    );
  }
}
