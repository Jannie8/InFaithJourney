import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIERS = new Set(['free', 'standard', 'featured']);

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const { applicationId, tier } = await req.json();
    if (typeof applicationId !== 'string' || typeof tier !== 'string' || !TIERS.has(tier)) {
      return NextResponse.json({ error: 'Choose a valid membership plan.' }, { status: 400 });
    }

    const db = getAdminDb();
    const applicationRef = db.collection('vendorApplications').doc(applicationId);
    const vendorRef = db.collection('vendors').doc(user.uid);
    const [application, vendor] = await Promise.all([applicationRef.get(), vendorRef.get()]);
    const applicationData = application.data();
    const vendorData = vendor.data();
    const wasApproved = applicationData?.previouslyApproved === true
      || applicationData?.approvedAt != null
      || (vendorData?.applicationId === applicationId && vendorData?.approvedAt != null);

    if (
      !application.exists
      || applicationData?.submitterUid !== user.uid
      || applicationData?.applicationStatus !== 'cancelled'
      || !wasApproved
    ) {
      return NextResponse.json({ error: 'A previously approved cancelled application is required.' }, { status: 403 });
    }

    const isFree = tier === 'free';
    const batch = db.batch();
    batch.update(applicationRef, {
      applicationStatus: 'approved',
      selectedPlan: tier,
      previouslyApproved: true,
      renewedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      cancelledAt: FieldValue.delete(),
    });
    batch.set(vendorRef, {
      membershipTier: tier,
      membershipStatus: isFree ? 'active' : 'awaiting_payment',
      listingStatus: isFree ? 'active' : 'inactive',
      applicationId,
      submitterUid: user.uid,
      email: user.email ?? applicationData.email ?? '',
      renewedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      cancelledAt: FieldValue.delete(),
    }, { merge: true });
    await batch.commit();

    return NextResponse.json({ renewed: true, tier, requiresPayment: !isFree });
  } catch (error) {
    console.error('Vendor membership renewal failed:', error);
    return NextResponse.json({ error: 'Could not renew the membership.' }, { status: 500 });
  }
}
