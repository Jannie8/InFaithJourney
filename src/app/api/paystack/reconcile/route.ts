import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getCustomerSubscription } from '@/lib/paystack';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    if (!user.email) return NextResponse.json({ active: false });

    const subscription = await getCustomerSubscription(user.email);
    if (!subscription || subscription.status !== 'active' || !subscription.tier) {
      return NextResponse.json({ active: false });
    }

    const db = getAdminDb();
    const applications = await db.collection('vendorApplications')
      .where('submitterUid', '==', user.uid)
      .get();
    const application = applications.docs.find(doc => {
      const data = doc.data();
      return data.applicationStatus === 'approved' && data.selectedPlan === subscription.tier;
    });
    if (!application) return NextResponse.json({ active: false });

    await db.collection('vendors').doc(user.uid).set({
      membershipStatus: 'active',
      membershipTier: subscription.tier,
      paystackSubscriptionCode: subscription.subscriptionCode,
      email: user.email,
      submitterUid: user.uid,
      applicationId: application.id,
      reconciledAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ active: true, tier: subscription.tier });
  } catch (error) {
    console.error('PayStack reconciliation failed:', error);
    return NextResponse.json({ error: 'Could not check the existing subscription.' }, { status: 500 });
  }
}
