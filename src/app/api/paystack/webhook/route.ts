import { NextRequest, NextResponse } from 'next/server';
import { TIER_AMOUNTS, verifyWebhookSignature, getCustomerSubscription, disableSubscription, type VendorTier } from '@/lib/paystack';
import { syncVendorSubscription } from '@/lib/membership-sync';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Server only — verifies PayStack's signature with the secret key and updates
// vendor membership status on recurring billing events.
export const runtime = 'nodejs';
// Never cache or pre-render: every call is a unique signed event.
export const dynamic = 'force-dynamic';

/** Match recurring events by stable IDs; renewal references change every month. */
async function refreshVendor(data: any): Promise<number> {
  const db = getAdminDb();
  const subscriptionCode = data?.subscription_code ?? data?.subscription?.subscription_code;
  const customerCode = data?.customer?.customer_code;
  const email = data?.customer?.email;
  let vendors = subscriptionCode
    ? await db.collection('vendors').where('paystackSubscriptionCode', '==', subscriptionCode).get() : null;
  if ((!vendors || vendors.empty) && customerCode) {
    vendors = await db.collection('vendors').where('paystackCustomerCode', '==', customerCode).get();
  }
  if ((!vendors || vendors.empty) && email) {
    vendors = await db.collection('vendors').where('email', '==', email).get();
  }
  if (!vendors || vendors.empty) return 0;
  for (const vendor of vendors.docs) {
    const customerEmail = vendor.data().email || email;
    if (!customerEmail) throw new Error('Missing vendor billing email.');
    await syncVendorSubscription(vendor.id, customerEmail);
  }
  return vendors.size;
}

async function activateVendorFromCharge(data: any): Promise<boolean> {
  const uid = data?.metadata?.uid;
  const applicationId = data?.metadata?.applicationId;
  const tier = data?.metadata?.tier as VendorTier | undefined;
  if (
    typeof uid !== 'string' ||
    typeof applicationId !== 'string' ||
    (tier !== 'standard' && tier !== 'featured') ||
    data?.amount !== TIER_AMOUNTS[tier] ||
    data?.currency !== 'ZAR'
  ) return false;

  const db = getAdminDb();
  const applicationRef = db.collection('vendorApplications').doc(applicationId);
  const vendorRef = db.collection('vendors').doc(uid);
  const vendor = await vendorRef.get();
  if (vendor.data()?.paystackReference !== data?.reference) return false;
  const changePlan = data?.metadata?.changePlan === true;
  const previousCode = data?.metadata?.previousSubscriptionCode;
  if (changePlan && typeof previousCode === 'string') {
    const application = await applicationRef.get();
    if (application.data()?.applicationStatus !== 'approved' || application.data()?.submitterUid !== uid) return false;
    const previous = await getCustomerSubscription(vendor.data()!.email, previousCode);
    if (previous && !['non-renewing', 'cancelled', 'completed'].includes(previous.status)) {
      if (!previous.emailToken) throw new Error('Previous subscription cannot be cancelled.');
      await disableSubscription(previous.subscriptionCode, previous.emailToken);
    }
  }
  return db.runTransaction(async transaction => {
    const application = await transaction.get(applicationRef);
    const currentVendor = await transaction.get(vendorRef);
    const applicationData = application.data();
    if (!application.exists || applicationData?.submitterUid !== uid
      || applicationData?.applicationStatus !== 'approved'
      || currentVendor.data()?.paystackReference !== data?.reference
      || (!changePlan && applicationData?.selectedPlan !== tier)) return false;
    if (changePlan) transaction.update(applicationRef, { selectedPlan: tier, updatedAt: FieldValue.serverTimestamp() });
    transaction.set(db.collection('vendors').doc(uid), {
      membershipStatus: 'active',
      listingStatus: 'active',
      membershipTier: tier,
      applicationId,
      email: data?.customer?.email ?? null,
      submitterUid: uid,
      paystackReference: data?.reference ?? null,
      paystackCustomerCode: data?.customer?.customer_code ?? null,
      lastPaymentReference: data?.reference ?? null,
      lastPaymentAt: data?.paid_at ? new Date(data.paid_at) : FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    return true;
  });
}

export async function POST(req: NextRequest) {
  // 1. Read the RAW body — the signature is computed over the exact bytes sent.
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  // 2. Reject anything we can't cryptographically verify came from PayStack.
  let valid = false;
  try {
    valid = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    // Secret key missing/misconfigured — log and 500 so PayStack retries later.
    console.error('PayStack webhook: signature check threw:', err);
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  // 3. Parse and route the event.
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Bad JSON.' }, { status: 400 });
  }

  const type = event?.event as string | undefined;
  const data = event?.data ?? {};

  try {
    switch (type) {
      // A payment succeeded — initial charge OR a monthly renewal. Keep membership active.
      case 'charge.success': {
        const activated = await activateVendorFromCharge(data);
        const refreshed = await refreshVendor(data);
        if (!activated && !refreshed && data?.metadata?.uid) {
          throw new Error('Membership payment could not be matched; retry required.');
        }
        break;
      }
      case 'subscription.create':
      case 'invoice.payment_failed':
      case 'invoice.update':
      case 'subscription.disable':
      case 'subscription.not_renew': {
        const matched = await refreshVendor(data);
        // Initial subscription events can arrive before the checkout record write.
        // Do not acknowledge a relevant event that we have silently dropped.
        const plan = data?.plan?.plan_code ?? data?.subscription?.plan?.plan_code;
        if (!matched && (plan === process.env.PAYSTACK_PLAN_STANDARD || plan === process.env.PAYSTACK_PLAN_FEATURED)) {
          throw new Error('Subscription could not be matched; retry required.');
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged so PayStack stops retrying.
        break;
    }
  } catch (err) {
    console.error(`PayStack webhook: failed handling "${type}":`, err);
    // 500 tells PayStack to retry the delivery.
    return NextResponse.json({ error: 'Processing failed.' }, { status: 500 });
  }

  // 4. Always 200 on success so PayStack marks the event delivered.
  return NextResponse.json({ received: true });
}
