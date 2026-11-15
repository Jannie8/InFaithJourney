import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { getCustomerSubscription, type SubscriptionDetails } from '@/lib/paystack';

/** Refresh from Paystack, rather than trusting the order of webhook deliveries. */
export async function syncVendorSubscription(uid: string, email: string): Promise<SubscriptionDetails | null> {
  const db = getAdminDb();
  const vendorRef = db.collection('vendors').doc(uid);
  const vendor = await vendorRef.get();
  const subscription = await getCustomerSubscription(email)
    ?? (vendor.data()?.paystackSubscriptionCode
      ? await getCustomerSubscription(email, vendor.data()?.paystackSubscriptionCode) : null);
  if (!subscription?.tier) return subscription;

  const applications = await db.collection('vendorApplications').where('submitterUid', '==', uid).get();
  const application = applications.docs.find(doc =>
    doc.id === vendor.data()?.applicationId
  ) ?? applications.docs.find(doc => doc.data().applicationStatus === 'approved'
    && doc.data().selectedPlan === subscription.tier);
  if (!application) return subscription;

  await db.runTransaction(async transaction => {
    const current = await transaction.get(application.ref);
    if (current.data()?.selectedPlan !== subscription.tier) return;
    const approved = current.data()?.applicationStatus === 'approved'
      && current.data()?.selectedPlan === subscription.tier;
    // Non-renewing subscriptions retain their paid access until Paystack disables them.
    const active = approved && ['active', 'non-renewing'].includes(subscription.status);
    transaction.set(vendorRef, {
      membershipStatus: active ? 'active' : (approved && subscription.status === 'attention' ? 'past_due' : 'inactive'),
      listingStatus: active ? 'active' : 'inactive',
      membershipTier: subscription.tier,
      paystackSubscriptionCode: subscription.subscriptionCode,
      paystackSubscriptionStatus: subscription.status,
      subscriptionRenews: subscription.status === 'active',
      email,
      submitterUid: uid,
      applicationId: application.id,
      reconciledAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  });
  return subscription;
}
