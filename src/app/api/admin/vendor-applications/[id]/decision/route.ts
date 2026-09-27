import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { sendVendorApprovalEmail } from '@/lib/vendor-approval-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const decodedToken = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const db = getAdminDb();
    const adminRole = await db.collection('roles_admin').doc(decodedToken.uid).get();
    if (!adminRole.exists) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { decision } = await req.json();
    if (decision !== 'approved' && decision !== 'rejected') {
      return NextResponse.json({ error: 'Invalid decision.' }, { status: 400 });
    }

    const { id } = await context.params;
    const applicationRef = db.collection('vendorApplications').doc(id);
    const application = await applicationRef.get();
    if (!application.exists) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }
    if (application.data()?.applicationStatus !== 'pending') {
      return NextResponse.json({ error: 'This application has already been reviewed.' }, { status: 409 });
    }

    const data = application.data()!;
    const decisionBatch = db.batch();
    decisionBatch.update(applicationRef, {
      applicationStatus: decision,
      reviewedAt: FieldValue.serverTimestamp(),
      reviewedBy: decodedToken.uid,
      ...(decision === 'approved' ? { approvedAt: FieldValue.serverTimestamp() } : {}),
    });

    // Approval immediately publishes a canonical vendor document. Paid plans can
    // still be awaiting activation; listing visibility is intentionally separate
    // from billing state so approved vendors appear in marketplace browsing.
    if (decision === 'approved') {
      const categorySlug = String(data.category ?? 'vendors')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .replace('photography-and-videography', 'photography-videography')
        .replace('flowers-and-decor', 'flowers-decor')
        .replace('music-and-entertainment', 'music-entertainment')
        .replace('planning-and-coordination', 'planning-coordination');
      decisionBatch.set(db.collection('vendors').doc(data.submitterUid), {
        name: data.businessName ?? 'Unnamed Business',
        businessName: data.businessName ?? 'Unnamed Business',
        ownerName: data.ownerName ?? '',
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        websiteUrl: data.websiteUrl ?? '',
        instagramHandle: data.instagramHandle ?? '',
        location: data.location ?? 'South Africa',
        category: data.category ?? 'Vendors',
        categorySlug,
        description: data.description ?? '',
        servicesOffered: data.servicesOffered ?? '',
        pricingRange: data.pricingRange ?? '',
        imageUrl: data.coverImageUrl || data.logoUrl || '/wedding.png',
        coverImageUrl: data.coverImageUrl ?? '',
        logoUrl: data.logoUrl ?? '',
        portfolioImageUrls: data.portfolioImageUrls ?? [],
        imageHint: `${data.category ?? 'wedding'} vendor`,
        rating: 5,
        reviews: 0,
        listingStatus: data.selectedPlan === 'free' ? 'active' : 'inactive',
        membershipTier: data.selectedPlan ?? 'free',
        membershipStatus: data.selectedPlan === 'free' ? 'active' : 'awaiting_payment',
        applicationId: application.id,
        submitterUid: data.submitterUid,
        approvedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await decisionBatch.commit();

    if (decision === 'rejected') {
      return NextResponse.json({ decision, emailSent: false });
    }

    if (!data.email || typeof data.email !== 'string') {
      return NextResponse.json({ decision, emailSent: false, emailError: 'The application has no email address.' });
    }

    try {
      await sendVendorApprovalEmail({
        to: data.email,
        ownerName: data.ownerName,
        businessName: data.businessName,
        selectedPlan: data.selectedPlan,
        activationUrl: `${req.nextUrl.origin}/dashboard#activate-membership`,
      });
      await applicationRef.update({ approvalEmailSentAt: FieldValue.serverTimestamp() });
      return NextResponse.json({ decision, emailSent: true });
    } catch (error) {
      console.error('Vendor approval email failed:', error);
      await applicationRef.update({
        approvalEmailError: error instanceof Error ? error.message.slice(0, 500) : 'Unknown email error',
      });
      return NextResponse.json({ decision, emailSent: false, emailError: 'Approval saved, but the email could not be sent.' });
    }
  } catch (error) {
    console.error('Vendor application decision failed:', error);
    return NextResponse.json({ error: 'Could not review the application.' }, { status: 500 });
  }
}
