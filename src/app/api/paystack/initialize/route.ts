import { NextRequest, NextResponse } from 'next/server';
import { initializeSubscription, type VendorTier } from '@/lib/paystack';

// This route runs on the server only — the secret key never reaches the browser.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, tier, uid, applicationId } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }
    if (tier !== 'standard' && tier !== 'featured') {
      return NextResponse.json({ error: 'tier must be "standard" or "featured".' }, { status: 400 });
    }

    // Where PayStack sends the customer back after paying.
    const origin = req.nextUrl.origin;
    const callbackUrl = `${origin}/dashboard?paystack=return`;

    const result = await initializeSubscription({
      email,
      tier: tier as VendorTier,
      callbackUrl,
      metadata: { uid: uid ?? null, applicationId: applicationId ?? null },
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('PayStack initialize error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to start payment.' },
      { status: 500 }
    );
  }
}
