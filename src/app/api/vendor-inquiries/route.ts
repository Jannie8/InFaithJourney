import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { sendVendorInquiryEmail } from '@/lib/vendor-inquiry-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vendorId = typeof body.vendorId === 'string' ? body.vendorId.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';
    const weddingDate = typeof body.weddingDate === 'string' ? body.weddingDate.trim().slice(0, 30) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';
    if (!vendorId || !name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide your name, a valid email, and a message.' }, { status: 400 });
    }

    const db = getAdminDb();
    const vendor = await db.collection('vendors').doc(vendorId).get();
    const vendorData = vendor.data();
    if (!vendor.exists || vendorData?.membershipStatus !== 'active') {
      return NextResponse.json({ error: 'This vendor is not currently accepting inquiries.' }, { status: 404 });
    }

    const inquiry = await db.collection('inquiries').add({
      vendorId,
      vendorName: vendorData.businessName || vendorData.name || 'Vendor',
      userProfileId: null,
      name,
      email,
      weddingDate,
      message,
      status: 'new',
      createdAt: FieldValue.serverTimestamp(),
    });

    let emailSent = false;
    if (typeof vendorData.email === 'string' && vendorData.email.trim()) {
      try {
        await sendVendorInquiryEmail({
          to: vendorData.email.trim(),
          vendorName: vendorData.businessName || vendorData.name || 'your business',
          senderName: name,
          senderEmail: email,
          weddingDate,
          message,
          profileUrl: `${req.nextUrl.origin}/vendor/${encodeURIComponent(vendorId)}`,
        });
        emailSent = true;
        await inquiry.update({ emailSentAt: FieldValue.serverTimestamp() });
      } catch (emailError) {
        console.error(`Inquiry ${inquiry.id} was saved but its vendor email failed:`, emailError);
        await inquiry.update({
          emailError: emailError instanceof Error ? emailError.message.slice(0, 500) : 'Unknown email error',
        });
      }
    }

    return NextResponse.json({ inquiryId: inquiry.id, emailSent }, { status: 201 });
  } catch (error) {
    console.error('Vendor inquiry submission failed:', error);
    return NextResponse.json({ error: 'Could not send the inquiry.' }, { status: 500 });
  }
}
