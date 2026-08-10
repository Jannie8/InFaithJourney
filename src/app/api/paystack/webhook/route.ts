import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/paystack';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Server only — verifies PayStack's signature with the secret key and updates
// vendor membership status on recurring billing events.
export const runtime = 'nodejs';
// Never cache or pre-render: every call is a unique signed event.
export const dynamic = 'force-dynamic';

/**
 * Find the vendor document(s) tied to a PayStack customer email and apply an update.
 * Vendor docs are keyed by the user's UID and store a denormalized `email` field
 * (written during activation), so we match on that. Returns how many docs changed.
 */
async function updateVendorByEmail(
  email: string | undefined,
  data: Record<string, unknown>
): Promise<number> {
  if (!email) return 0;
  const db = getAdminDb();
  const snap = await db.collection('vendors').where('email', '==', email).get();
  if (snap.empty) return 0;

  const batch = db.batch();
  snap.forEach((docSnap) => {
    batch.set(
      docSnap.ref,
      { ...data, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
  });
  await batch.commit();
  return snap.size;
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
  const email: string | undefined = data?.customer?.email;

  try {
    switch (type) {
      // A payment succeeded — initial charge OR a monthly renewal. Keep membership active.
      case 'charge.success':
        await updateVendorByEmail(email, {
          membershipStatus: 'active',
          lastPaymentAt: FieldValue.serverTimestamp(),
          lastPaymentReference: data?.reference ?? null,
        });
        break;

      // A subscription was created — record its codes so it can be managed later.
      case 'subscription.create':
        await updateVendorByEmail(email, {
          membershipStatus: 'active',
          paystackSubscriptionCode: data?.subscription_code ?? null,
          paystackCustomerCode: data?.customer?.customer_code ?? null,
        });
        break;

      // A renewal payment failed — flag the account but don't immediately revoke;
      // PayStack will retry, and the operator can follow up.
      case 'invoice.payment_failed':
        await updateVendorByEmail(email, { membershipStatus: 'past_due' });
        break;

      // Subscription cancelled or will not renew — membership lapses.
      case 'subscription.disable':
      case 'subscription.not_renew':
        await updateVendorByEmail(email, { membershipStatus: 'inactive' });
        break;

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
