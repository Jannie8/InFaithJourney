import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { sendAdminApplicationEmail } from '@/lib/admin-application-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APPLICATION_FIELDS = [
  'businessName', 'ownerName', 'email', 'phoneNumber', 'websiteUrl',
  'instagramHandle', 'location', 'category', 'description', 'yearsInBusiness',
  'pricingRange', 'servicesOffered', 'selectedPlan', 'agreedToTerms', 'logoUrl',
  'coverImageUrl', 'portfolioImageUrls',
] as const;

const ARRAY_FIELDS = new Set<string>(['portfolioImageUrls']);
const BOOLEAN_FIELDS = new Set<string>(['agreedToTerms']);

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const body = await req.json();
    const requiredFields = ['businessName', 'ownerName', 'email', 'phoneNumber', 'category', 'description'];
    if (requiredFields.some(field => typeof body[field] !== 'string' || !body[field].trim())) {
      return NextResponse.json({ error: 'Required application details are missing.' }, { status: 400 });
    }
    if (!['free', 'standard', 'featured'].includes(body.selectedPlan) || body.agreedToTerms !== true) {
      return NextResponse.json({ error: 'A valid plan and acceptance of the terms are required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const existing = await db.collection('vendorApplications')
      .where('submitterUid', '==', user.uid)
      .where('applicationStatus', '==', 'pending')
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'You already have an application pending review.' }, { status: 409 });
    }

    const applicationData: Record<string, unknown> = {};
    for (const field of APPLICATION_FIELDS) {
      if (ARRAY_FIELDS.has(field)) {
        applicationData[field] = Array.isArray(body[field])
          ? body[field].filter((value: unknown): value is string => typeof value === 'string').slice(0, 50)
          : [];
      } else if (BOOLEAN_FIELDS.has(field)) {
        applicationData[field] = body[field] === true;
      } else {
        applicationData[field] = typeof body[field] === 'string' ? body[field].trim().slice(0, 10_000) : '';
      }
    }
    const applicationRef = await db.collection('vendorApplications').add({
      ...applicationData,
      submitterUid: user.uid,
      applicationStatus: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Admin recipients come from roles_admin. Prefer an email stored on the role
    // document, otherwise resolve the role document ID as a Firebase Auth UID.
    const roles = await db.collection('roles_admin').get();
    const recipientResults = await Promise.all(roles.docs.map(async role => {
      const roleEmail = role.data().email;
      if (typeof roleEmail === 'string' && roleEmail.trim()) return roleEmail.trim();
      try {
        return (await getAdminAuth().getUser(role.id)).email ?? null;
      } catch (error) {
        console.error(`Could not resolve email for admin ${role.id}:`, error);
        return null;
      }
    }));
    const recipients = [...new Set(recipientResults.filter((email): email is string => !!email))];

    const deliveries = await Promise.allSettled(recipients.map(to => sendAdminApplicationEmail({
      to,
      businessName: String(body.businessName),
      ownerName: String(body.ownerName),
      category: String(body.category),
      selectedPlan: String(body.selectedPlan),
      reviewUrl: `${req.nextUrl.origin}/admin`,
    })));
    const emailsSent = deliveries.filter(result => result.status === 'fulfilled').length;
    const emailsFailed = deliveries.length - emailsSent;
    await applicationRef.update({
      adminNotificationAttemptedAt: FieldValue.serverTimestamp(),
      adminNotificationRecipientCount: recipients.length,
      adminNotificationSentCount: emailsSent,
      ...(emailsFailed > 0 || recipients.length === 0
        ? { adminNotificationError: recipients.length === 0 ? 'No admin email addresses were found.' : `${emailsFailed} admin email(s) failed.` }
        : {}),
    });

    return NextResponse.json({
      applicationId: applicationRef.id,
      adminNotificationSent: emailsSent > 0,
      adminNotificationRecipientCount: emailsSent,
    }, { status: 201 });
  } catch (error) {
    console.error('Vendor application submission failed:', error);
    return NextResponse.json({ error: 'Could not submit the application.' }, { status: 500 });
  }
}
