// Server-only PayStack helper. NEVER import this into a client component.
// It reads the secret key from the environment and talks to the PayStack API.

import crypto from 'crypto';

const PAYSTACK_BASE = 'https://api.paystack.co';

export type VendorTier = 'standard' | 'featured';

// Monthly price per tier, in ZAR cents (PayStack expects the smallest unit).
// R499 -> 49900, R1199 -> 119900. Must match the amounts on the plans.
export const TIER_AMOUNTS: Record<VendorTier, number> = {
  standard: 49900,
  featured: 119900,
};

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error('PAYSTACK_SECRET_KEY is not set. Add it to .env.local (dev) or Secret Manager (prod).');
  }
  return key;
}

export function getPlanCode(tier: VendorTier): string {
  const code =
    tier === 'featured'
      ? process.env.PAYSTACK_PLAN_FEATURED
      : process.env.PAYSTACK_PLAN_STANDARD;
  if (!code) {
    throw new Error(`Missing plan code for tier "${tier}". Check PAYSTACK_PLAN_* env vars.`);
  }
  return code;
}

async function paystackFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Some hosting IPs (e.g. cloud datacenters) get 403'd by PayStack's
      // edge firewall without a normal User-Agent. Send one explicitly.
      'User-Agent': 'InFaithJourney/1.0 (+https://infaithjourney.com)',
      ...(init?.headers || {}),
    },
    // Always hit PayStack fresh; never cache payment calls.
    cache: 'no-store',
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.status === false) {
    const message = body?.message || `PayStack request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

/**
 * Start a subscription checkout. Returns the hosted PayStack URL to redirect to.
 */
export async function initializeSubscription(params: {
  email: string;
  tier: VendorTier;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const body = await paystackFetch('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,
      amount: TIER_AMOUNTS[params.tier],
      plan: getPlanCode(params.tier),
      callback_url: params.callbackUrl,
      metadata: { tier: params.tier, ...(params.metadata || {}) },
    }),
  });

  return {
    authorizationUrl: body.data.authorization_url as string,
    reference: body.data.reference as string,
    accessCode: body.data.access_code as string,
  };
}

/**
 * Confirm a payment after the customer returns from PayStack.
 */
export async function verifyTransaction(reference: string) {
  const body = await paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`);
  const data = body.data;
  return {
    success: data.status === 'success',
    status: data.status as string,
    amount: data.amount as number, // in kobo/cents (ZAR cents)
    currency: data.currency as string,
    reference: data.reference as string,
    customerEmail: data.customer?.email as string | undefined,
    tier: (data.metadata?.tier as VendorTier | undefined) ?? undefined,
    metadata: data.metadata as Record<string, unknown> | undefined,
    paidAt: data.paid_at as string | undefined,
  };
}

/**
 * Verify the authenticity of an incoming PayStack webhook.
 *
 * PayStack signs every webhook with HMAC SHA512 of the *raw* request body, keyed
 * by your secret key, and sends it in the `x-paystack-signature` header. We must
 * compare against the raw body (not a re-serialized object) or the hash won't match.
 * Returns true only when the signature is present and valid.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha512', getSecretKey())
    .update(rawBody, 'utf8')
    .digest('hex');
  // Constant-time compare to avoid timing attacks; guard against length mismatch.
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Find the latest subscription for a customer email and return a hosted PayStack
 * link the customer can open to manage their own billing (update card, view
 * invoices, cancel, etc.). Returns null if no subscription exists for that email.
 *
 * Flow:
 *   1) Look up the PayStack customer by email.
 *   2) Pull their subscriptions and pick the most recent.
 *   3) Ask PayStack for a one-time manage link for that subscription.
 */
export async function getManageSubscriptionLink(email: string): Promise<string | null> {
  // 1. Customer lookup.
  let customer: any;
  try {
    const body = await paystackFetch(`/customer/${encodeURIComponent(email)}`);
    customer = body.data;
  } catch {
    // Either email not registered with PayStack yet, or no permission — treat as
    // "no subscription" rather than a hard error, so the UI can show a clean message.
    return null;
  }
  if (!customer?.customer_code) return null;

  // 2. Pull subscriptions for this customer and pick the newest one.
  const subsBody = await paystackFetch(
    `/subscription?customer=${encodeURIComponent(customer.customer_code)}&perPage=50`
  );
  const subs: any[] = subsBody?.data ?? [];
  if (subs.length === 0) return null;

  // Prefer "active" subs first; otherwise fall back to the most recently created one
  // so even a paused/expired subscription still gets a manage link (so they can re-up).
  const sorted = [...subs].sort((a, b) => {
    const ta = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
    const tb = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
    return tb - ta;
  });
  const chosen = sorted.find((s) => s.status === 'active') ?? sorted[0];
  if (!chosen?.subscription_code) return null;

  // 3. Generate the hosted manage link.
  const linkBody = await paystackFetch(
    `/subscription/${encodeURIComponent(chosen.subscription_code)}/manage/link`
  );
  return (linkBody?.data?.link as string) ?? null;
}

/**
 * Shape returned to the dashboard's in-app billing UI. All amounts are in ZAR cents
 * (PayStack's unit); the UI divides by 100 for display.
 */
export interface SubscriptionDetails {
  subscriptionCode: string;
  status: string;                     // "active" | "non-renewing" | "cancelled" | etc.
  emailToken: string | null;          // required by PayStack's disable endpoint.
  planCode: string;
  planName: string;
  amount: number;                     // ZAR cents
  currency: string;
  interval: string;                   // "monthly", etc.
  nextPaymentDate: string | null;     // ISO date string
  tier: VendorTier | null;            // matched to our standard/featured plan codes
  card: {
    last4: string | null;
    brand: string | null;             // e.g. "visa", "mastercard"
    expMonth: string | null;
    expYear: string | null;
  };
}

/**
 * Map a PayStack plan code back to our internal tier name. Returns null if it
 * doesn't match either of our configured plans (e.g. a legacy/manual subscription).
 */
function tierFromPlanCode(planCode: string | undefined | null): VendorTier | null {
  if (!planCode) return null;
  if (planCode === process.env.PAYSTACK_PLAN_STANDARD) return 'standard';
  if (planCode === process.env.PAYSTACK_PLAN_FEATURED) return 'featured';
  return null;
}

/**
 * Fetch the customer's most-recent subscription (preferring active) and return the
 * detailed shape the in-app billing UI needs. Returns null when nothing exists.
 */
export async function getCustomerSubscription(email: string): Promise<SubscriptionDetails | null> {
  // 1. Customer lookup.
  let customer: any;
  try {
    const body = await paystackFetch(`/customer/${encodeURIComponent(email)}`);
    customer = body.data;
  } catch {
    return null;
  }
  if (!customer?.customer_code) return null;

  // 2. List their subscriptions.
  const subsBody = await paystackFetch(
    `/subscription?customer=${encodeURIComponent(customer.customer_code)}&perPage=50`
  );
  const subs: any[] = subsBody?.data ?? [];
  if (subs.length === 0) return null;

  const sorted = [...subs].sort((a, b) => {
    const ta = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
    const tb = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
    return tb - ta;
  });
  const chosen = sorted.find((s) => s.status === 'active') ?? sorted[0];
  if (!chosen?.subscription_code) return null;

  // 3. Fetch full subscription details — only this call includes email_token + card auth.
  const detailsBody = await paystackFetch(
    `/subscription/${encodeURIComponent(chosen.subscription_code)}`
  );
  const d = detailsBody?.data ?? {};
  const auth = d.authorization ?? {};

  return {
    subscriptionCode: d.subscription_code,
    status: d.status,
    emailToken: d.email_token ?? null,
    planCode: d.plan?.plan_code ?? '',
    planName: d.plan?.name ?? '',
    amount: typeof d.amount === 'number' ? d.amount : (d.plan?.amount ?? 0),
    currency: d.plan?.currency ?? 'ZAR',
    interval: d.plan?.interval ?? 'monthly',
    nextPaymentDate: d.next_payment_date ?? null,
    tier: tierFromPlanCode(d.plan?.plan_code),
    card: {
      last4: auth.last4 ?? null,
      brand: auth.card_type ?? null,
      expMonth: auth.exp_month ?? null,
      expYear: auth.exp_year ?? null,
    },
  };
}

/**
 * Disable (cancel) a subscription. PayStack requires the email_token returned with
 * the subscription details — not the customer's email — as the second factor.
 */
export async function disableSubscription(subscriptionCode: string, emailToken: string) {
  await paystackFetch('/subscription/disable', {
    method: 'POST',
    body: JSON.stringify({ code: subscriptionCode, token: emailToken }),
  });
}

/** A single payment / invoice line surfaced to the billing UI. */
export interface InvoiceLine {
  id: number | string;
  reference: string | null;
  amount: number;          // ZAR cents
  currency: string;
  status: string;          // "success" | "failed" | "abandoned" | etc.
  paidAt: string | null;   // ISO date string
  channel: string | null;  // "card" etc.
}

/**
 * Recent payments for a customer email — used to render the invoice history list.
 * We pull transactions (PayStack's term for charges) rather than "invoices" because
 * a customer who hasn't signed up for a plan still has transactions to show.
 */
export async function getCustomerInvoices(email: string, limit = 12): Promise<InvoiceLine[]> {
  let customer: any;
  try {
    const body = await paystackFetch(`/customer/${encodeURIComponent(email)}`);
    customer = body.data;
  } catch {
    return [];
  }
  if (!customer?.customer_code) return [];

  const txBody = await paystackFetch(
    `/transaction?customer=${encodeURIComponent(customer.customer_code)}&perPage=${limit}`
  );
  const txs: any[] = txBody?.data ?? [];
  return txs.map((t) => ({
    id: t.id,
    reference: t.reference ?? null,
    amount: t.amount ?? 0,
    currency: t.currency ?? 'ZAR',
    status: t.status ?? 'unknown',
    paidAt: t.paid_at ?? t.paidAt ?? t.created_at ?? null,
    channel: t.channel ?? null,
  }));
}
