import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSubscription } from '@/lib/paystack';

// Server only — returns the active subscription details for the given email.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const sub = await getCustomerSubscription(email);
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
