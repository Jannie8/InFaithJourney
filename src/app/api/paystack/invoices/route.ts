import { NextRequest, NextResponse } from 'next/server';
import { getCustomerInvoices } from '@/lib/paystack';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

// Server only — returns the customer's recent payment history.
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

    const invoices = await getCustomerInvoices(user.email, 12, vendor.data()?.paystackCustomerCode);
    return NextResponse.json({ invoices });
  } catch (err: any) {
    console.error('PayStack invoices error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Failed to load invoices.' },
      { status: 500 }
    );
  }
}
