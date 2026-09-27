import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { vendorId } = await req.json();
    if (typeof vendorId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(vendorId)) {
      return NextResponse.json({ error: 'Invalid vendor.' }, { status: 400 });
    }
    const db = getAdminDb();
    const vendorRef = db.collection('vendors').doc(vendorId);
    const vendor = await vendorRef.get();
    if (!vendor.exists || vendor.data()?.listingStatus !== 'active') {
      return NextResponse.json({ error: 'Vendor not found.' }, { status: 404 });
    }
    const day = new Date().toISOString().slice(0, 10);
    await vendorRef.set({
      analytics: {
        profileViews: FieldValue.increment(1),
        dailyViews: { [day]: FieldValue.increment(1) },
        lastViewedAt: FieldValue.serverTimestamp(),
      },
    }, { merge: true });
    return NextResponse.json({ recorded: true });
  } catch (error) {
    console.error('Vendor view tracking failed:', error);
    return NextResponse.json({ error: 'Could not record view.' }, { status: 500 });
  }
}
