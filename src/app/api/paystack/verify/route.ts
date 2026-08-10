import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystack';

// Server only — confirms the payment with PayStack using the secret key.
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get('reference');
    if (!reference) {
      return NextResponse.json({ error: 'Missing reference.' }, { status: 400 });
    }

    const result = await verifyTransaction(reference);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('PayStack verify error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
