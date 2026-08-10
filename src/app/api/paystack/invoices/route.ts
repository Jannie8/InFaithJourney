import { NextRequest, NextResponse } from 'next/server';
import { getCustomerInvoices } from '@/lib/paystack';

// Server only — returns the customer's recent payment history.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const invoices = await getCustomerInvoices(email);
    return NextResponse.json({ invoices });
  } catch (err: any) {
    console.error('PayStack invoices error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to load invoices.' },
      { status: 500 }
    );
  }
}
