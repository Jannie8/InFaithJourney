import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function categorySlugFor(category: string) {
  return category.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace('photography-and-videography', 'photography-videography')
    .replace('flowers-and-decor', 'flowers-decor')
    .replace('music-and-entertainment', 'music-entertainment')
    .replace('planning-and-coordination', 'planning-coordination');
}

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const user = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const { applicationId } = await req.json();
    if (typeof applicationId !== 'string') {
      return NextResponse.json({ error: 'Application required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const application = await db.collection('vendorApplications').doc(applicationId).get();
    const data = application.data();
    if (!application.exists || data?.submitterUid !== user.uid || data?.applicationStatus !== 'approved') {
      return NextResponse.json({ error: 'Approved application not found.' }, { status: 403 });
    }

    const category = String(data.category ?? 'Vendors');
    const vendorRef = db.collection('vendors').doc(user.uid);
    const existing = await vendorRef.get();
    const membershipStatus = existing.data()?.membershipStatus ?? (data.selectedPlan === 'free' ? 'active' : 'awaiting_payment');
    await vendorRef.set({
      name: data.businessName ?? 'Unnamed Business',
      businessName: data.businessName ?? 'Unnamed Business',
      ownerName: data.ownerName ?? '',
      email: data.email ?? user.email ?? '',
      phoneNumber: data.phoneNumber ?? '',
      websiteUrl: data.websiteUrl ?? '',
      instagramHandle: data.instagramHandle ?? '',
      location: data.location ?? 'South Africa',
      category,
      categorySlug: categorySlugFor(category),
      description: data.description ?? '',
      servicesOffered: data.servicesOffered ?? '',
      pricingRange: data.pricingRange ?? '',
      imageUrl: data.coverImageUrl || data.logoUrl || '/wedding.png',
      coverImageUrl: data.coverImageUrl ?? '',
      logoUrl: data.logoUrl ?? '',
      portfolioImageUrls: data.portfolioImageUrls ?? [],
      imageHint: `${category} vendor`,
      rating: existing.data()?.rating ?? 5,
      reviews: existing.data()?.reviews ?? 0,
      listingStatus: membershipStatus === 'active' ? 'active' : 'inactive',
      membershipTier: data.selectedPlan ?? 'free',
      membershipStatus,
      applicationId,
      submitterUid: user.uid,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    return NextResponse.json({ synced: true });
  } catch (error) {
    console.error('Vendor listing sync failed:', error);
    return NextResponse.json({ error: 'Could not publish the vendor listing.' }, { status: 500 });
  }
}
