import { NextRequest, NextResponse } from 'next/server';
import { getManageSubscriptionLink } from '@/lib/paystack';
import { getAdminAuth } from '@/lib/firebase-admin';

// Server only — uses the PayStack secret key to mint a hosted self-service link
// the customer can use to manage their own billing (card update, invoices, cancel).
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    if (!user.email) return NextResponse.json({ error: 'No account email found.' }, { status: 400 });

    const link = await getManageSubscriptionLink(user.email);
    if (!link) {
      return NextResponse.json(
        { error: 'No PayStack subscription found for this account yet.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ link });
  } catch (err: any) {
    console.error('PayStack manage link error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to load billing portal.' },
      { status: 500 }
    );
  }
}
