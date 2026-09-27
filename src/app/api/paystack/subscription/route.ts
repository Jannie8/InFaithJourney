import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSubscription } from '@/lib/paystack';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

// Server only — returns the active subscription details for the given email.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    if (!user.email) return NextResponse.json({ error: 'No account email found.' }, { status: 400 });
    const vendor = await getAdminDb().collection('vendors').doc(user.uid).get();

    const sub = await getCustomerSubscription(user.email, vendor.data()?.paystackSubscriptionCode);
    if (!sub) {
      // 200 with null so the UI can render an "inactive" state without treating
      // the missing-sub case as an error.
      return NextResponse.json({ subscription: null });
    }
    return NextResponse.json({ subscription: sub });
  } catch (err: any) {
    console.error('PayStack subscription lookup error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to load subscription.' },
      { status: 500 }
    );
  }
}
