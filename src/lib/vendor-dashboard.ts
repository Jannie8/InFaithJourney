import { collection, limit, query, where, type Firestore } from 'firebase/firestore';

/** Bound the owner query to work with existing deployed Firestore rules too. */
export function vendorApplicationsQuery(db: Firestore, uid: string) {
  return query(collection(db, 'vendorApplications'), where('submitterUid', '==', uid), limit(100));
}

type Application = { id: string; submitterUid?: string; createdAt?: { seconds?: number } };
export function selectVendorApplication<T extends Application>(applications: T[] | null, linked: T | null, uid?: string): T | null {
  if (!uid) return null;
  const owned = (applications ?? []).filter(item => item.submitterUid === uid);
  // Use the canonical linked application if collection access is unavailable.
  if (linked && linked.submitterUid === uid && !owned.some(item => item.id === linked.id)) owned.push(linked);
  return owned.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))[0] ?? null;
}

export function membershipDescription(tier?: string, renews?: boolean): string {
  if (tier === 'free') return 'Your Free Listing is active. There is no monthly subscription charge.';
  if (tier !== 'standard' && tier !== 'featured') return 'Your vendor membership is active.';
  const plan = tier === 'featured' ? 'Featured' : 'Standard';
  return renews === false
    ? `Your ${plan} Vendor membership is active for the remaining paid period and will not renew automatically.`
    : `Your ${plan} Vendor subscription is confirmed and billing monthly. Thank you for joining InFaith Journey.`;
}
