import { NextRequest, NextResponse } from 'next/server';
import { syncVendorSubscription } from '@/lib/membership-sync';
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

    const subscription = await syncVendorSubscription(user.uid, user.email);
    const vendor = await getAdminDb().collection('vendors').doc(user.uid).get();
    return NextResponse.json({ active: vendor.data()?.membershipStatus === 'active', tier: subscription?.tier });
  } catch (error) {
    console.error('PayStack reconciliation failed:', error);
    return NextResponse.json({ error: 'Could not check the existing subscription.' }, { status: 500 });
  }
}
