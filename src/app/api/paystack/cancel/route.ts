import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSubscription, disableSubscription } from '@/lib/paystack';

// Server only — cancels the customer's active subscription with PayStack.
// PayStack's webhook (subscription.disable) will fire back to /api/paystack/webhook
// which is what actually flips the vendor's membershipStatus to "inactive" in
// Firestore. We don't write Firestore here so the source of truth stays consistent.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    // Fetch current subscription so we have the subscription_code + email_token
    // PayStack requires for the disable call.
    const sub = await getCustomerSubscription(email);
    if (!sub) {
      return NextResponse.json(
        { error: 'No active subscription found to cancel.' },
        { status: 404 }
      );
    }
    if (!sub.emailToken) {
      // Defensive — every subscription PayStack returns includes an email_token,
      // but if we ever get one without it, we can't disable safely.
      return NextResponse.json(
        { error: 'This subscription cannot be cancelled from the app — contact support.' },
        { status: 409 }
      );
    }

    await disableSubscription(sub.subscriptionCode, sub.emailToken);
    return NextResponse.json({ cancelled: true, subscriptionCode: sub.subscriptionCode });
  } catch (err: any) {
    console.error('PayStack cancel error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to cancel subscription.' },
      { status: 500 }
    );
  }
}
