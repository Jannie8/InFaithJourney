import { NextRequest, NextResponse } from 'next/server';
import { getManageSubscriptionLink } from '@/lib/paystack';

// Server only — uses the PayStack secret key to mint a hosted self-service link
// the customer can use to manage their own billing (card update, invoices, cancel).
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const link = await getManageSubscriptionLink(email);
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
