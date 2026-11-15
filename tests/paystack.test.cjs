const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const crypto = require('node:crypto');

process.env.PAYSTACK_SECRET_KEY = 'test-secret';
process.env.PAYSTACK_PLAN_STANDARD = 'PLN_standard';
process.env.PAYSTACK_PLAN_FEATURED = 'PLN_featured';
const email = 'vendor@example.com';

// Compile the production TypeScript without adding a test runtime dependency.
function load(file, mocks = {}, cache = new Map()) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('require', 'module', 'exports', js)((name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith('@/')) return load(`src/${name.slice(2)}.ts`, mocks, cache);
    return require(name);
  }, module, module.exports);
  return module.exports;
}

function database(status = 'pending_payment', applicationStatus = 'approved') {
  const rows = {
    'vendors/uid': { email, membershipStatus: status, applicationId: 'app', paystackReference: 'initial', paystackSubscriptionCode: 'SUB_one' },
    'vendorApplications/app': { submitterUid: 'uid', selectedPlan: 'standard', applicationStatus },
  };
  const doc = key => ({ id: key.split('/')[1], get: async () => snap(key),
    set: async data => { rows[key] = { ...rows[key], ...data }; },
    update: async data => { rows[key] = { ...rows[key], ...data }; }, key });
  const snap = key => ({ id: key.split('/')[1], exists: !!rows[key], data: () => rows[key], ref: doc(key) });
  const query = (name, field, value) => ({ get: async () => {
    const docs = Object.keys(rows).filter(k => k.startsWith(`${name}/`) && rows[k][field] === value).map(snap);
    return { docs, empty: !docs.length, size: docs.length };
  } });
  const batch = () => {
    const writes = [];
    return { set: (ref, data) => writes.push([ref, data]), update: (ref, data) => writes.push([ref, data]),
      commit: async () => { for (const [ref, data] of writes) await ref.set(data); } };
  };
  const db = { collection: name => ({ doc: id => doc(`${name}/${id}`), where: (field, op, value) => query(name, field, value) }),
    batch, runTransaction: async fn => { const b = batch(); const value = await fn({ get: ref => ref.get(), set: b.set, update: b.update }); await b.commit(); return value; } };
  const mocks = {
    '@/lib/firebase-admin': { getAdminDb: () => db, getAdminAuth: () => ({ verifyIdToken: async () => ({ uid: 'uid', email }) }) },
    'firebase-admin/firestore': { FieldValue: { serverTimestamp: () => 'timestamp' } },
  };
  return { rows, mocks };
}

function paystack(options = {}) {
  const subscriptions = options.subscriptions ?? [{ subscription_code: 'SUB_one', status: 'active', plan: { plan_code: 'PLN_standard', currency: 'ZAR' }, customer: { email }, email_token: 'token' }];
  const calls = [];
  global.fetch = async (url, init = {}) => {
    const u = new URL(url); calls.push([u, init]);
    if (options.outage) return Response.json({ status: false, message: 'Unavailable' }, { status: 503 });
    if (u.pathname.startsWith('/customer/')) return Response.json({ status: true, data: { id: 42, customer_code: 'CUS_code' } });
    if (u.pathname === '/subscription' || u.pathname === '/transaction') {
      assert.equal(u.searchParams.get('customer'), '42');
      return Response.json({ status: true, data: u.pathname === '/subscription' ? subscriptions : [] });
    }
    if (u.pathname === '/subscription/disable') {
      const { code, token } = JSON.parse(init.body);
      assert.equal(token, 'token');
      if (options.disableError) return Response.json({ status: false, message: 'Disable failed' }, { status: 400 });
      if (!options.unconfirmed) subscriptions.find(s => s.subscription_code === code).status = 'non-renewing';
      return Response.json({ status: true });
    }
    const sub = subscriptions.find(s => u.pathname === `/subscription/${s.subscription_code}`);
    if (sub) return Response.json({ status: true, data: sub });
    throw new Error(`Unexpected Paystack request: ${url}`);
  };
  return { calls, subscriptions };
}
function request(body) {
  return new Request('http://localhost/api/paystack/cancel', { method: 'POST', headers: { authorization: 'Bearer token', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
function webhook(data, event = 'charge.success', signed = true) {
  const body = JSON.stringify({ event, data });
  return new Request('http://localhost/api/paystack/webhook', { method: 'POST', body,
    headers: { 'x-paystack-signature': signed ? crypto.createHmac('sha512', 'test-secret').update(body).digest('hex') : 'invalid' } });
}

test('cancels Paystack even while Firebase is awaiting payment', async () => {
  const { calls } = paystack(); const { rows, mocks } = database();
  const res = await load('src/app/api/paystack/cancel/route.ts', mocks).POST(request({ applicationId: 'app' }));
  assert.equal(res.status, 200);
  assert.equal(calls.filter(([u]) => u.pathname === '/subscription/disable').length, 1);
  assert.equal(rows['vendorApplications/app'].applicationStatus, 'cancelled');
  assert.equal(rows['vendors/uid'].membershipStatus, 'inactive');
});

test('API lookup errors never become a successful cancellation', async () => {
  paystack({ outage: true }); const { rows, mocks } = database();
  const res = await load('src/app/api/paystack/cancel/route.ts', mocks).POST(request({ applicationId: 'app' }));
  assert.equal(res.status, 500);
  assert.equal(rows['vendorApplications/app'].applicationStatus, 'approved');
});

for (const mode of ['disableError', 'unconfirmed']) test(`does not mark cancelled when ${mode}`, async () => {
  paystack({ [mode]: true }); const { rows, mocks } = database();
  const res = await load('src/app/api/paystack/cancel/route.ts', mocks).POST(request({ applicationId: 'app' }));
  assert.equal(res.status, 500);
  assert.equal(rows['vendorApplications/app'].applicationStatus, 'approved');
});

test('cancels duplicate renewable memberships and leaves other plans alone', async () => {
  const { subscriptions } = paystack();
  subscriptions.push({ ...subscriptions[0], subscription_code: 'SUB_two', status: 'attention' },
    { ...subscriptions[0], subscription_code: 'SUB_other', plan: { plan_code: 'PLN_other' } });
  const codes = await load('src/lib/paystack.ts').cancelCustomerSubscriptions(email);
  assert.deepEqual(codes, ['SUB_one', 'SUB_two']);
  assert.equal(subscriptions[2].status, 'active');
});

test('uses numeric ID for both subscription and invoice lookups', async () => {
  paystack(); const api = load('src/lib/paystack.ts');
  assert.equal((await api.getCustomerSubscription(email)).subscriptionCode, 'SUB_one');
  assert.deepEqual(await api.getCustomerInvoices(email, 12, 'CUS_code'), []);
});

test('renewal with a new reference repairs awaiting payment from Paystack', async () => {
  paystack(); const { rows, mocks } = database();
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({ reference: 'renewal-new-reference', customer: { email } }));
  assert.equal(res.status, 200);
  assert.equal(rows['vendors/uid'].membershipStatus, 'active');
  assert.equal(rows['vendors/uid'].paystackSubscriptionCode, 'SUB_one');
});

test('late disable for an older subscription cannot deactivate a currently active subscription', async () => {
  paystack(); const { rows, mocks } = database('active');
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({ subscription_code: 'SUB_old', customer: { email } }, 'subscription.disable'));
  assert.equal(res.status, 200);
  assert.equal(rows['vendors/uid'].membershipStatus, 'active');
});

test('late charge cannot reactivate an application the vendor cancelled', async () => {
  paystack(); const { rows, mocks } = database('inactive', 'cancelled');
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({ amount: 49900, currency: 'ZAR', reference: 'initial',
    metadata: { uid: 'uid', applicationId: 'app', tier: 'standard' }, customer: { email } }));
  assert.equal(res.status, 200);
  assert.equal(rows['vendors/uid'].membershipStatus, 'inactive');
});

test('invalid webhook signatures do not write membership state', async () => {
  paystack(); const { rows, mocks } = database();
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({}, 'subscription.create', false));
  assert.equal(res.status, 401);
  assert.equal(rows['vendors/uid'].membershipStatus, 'pending_payment');
});

test('unmatched subscription creation requests retry rather than dropping the event', async () => {
  paystack(); const { mocks } = database();
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({ customer: { email: 'unknown@example.com' }, plan: { plan_code: 'PLN_standard' } }, 'subscription.create'));
  assert.equal(res.status, 500);
});

test('billing reconciliation removes access after Paystack cancellation', async () => {
  const { subscriptions } = paystack(); subscriptions[0].status = 'cancelled';
  const { rows, mocks } = database('active');
  await load('src/lib/membership-sync.ts', mocks).syncVendorSubscription('uid', email);
  assert.equal(rows['vendors/uid'].membershipStatus, 'inactive');
});

test('initial payment activates without the browser returning from checkout', async () => {
  paystack({ subscriptions: [] }); const { rows, mocks } = database();
  delete rows['vendors/uid'].paystackSubscriptionCode;
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({ amount: 49900, currency: 'ZAR', reference: 'initial',
    metadata: { uid: 'uid', applicationId: 'app', tier: 'standard' }, customer: { email, customer_code: 'CUS_code' } }));
  assert.equal(res.status, 200);
  assert.equal(rows['vendors/uid'].membershipStatus, 'active');
  assert.equal(rows['vendors/uid'].paystackCustomerCode, 'CUS_code');
});

test('stale initial payment cannot activate a different current checkout', async () => {
  paystack({ subscriptions: [] }); const { rows, mocks } = database();
  rows['vendors/uid'].paystackReference = 'new-checkout';
  delete rows['vendors/uid'].paystackSubscriptionCode;
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({ amount: 49900, currency: 'ZAR', reference: 'initial',
    metadata: { uid: 'uid', applicationId: 'app', tier: 'standard' }, customer: { email } }));
  assert.equal(res.status, 200);
  assert.equal(rows['vendors/uid'].membershipStatus, 'pending_payment');
});

test('a stored subscription belonging to another customer is rejected', async () => {
  const { subscriptions } = paystack(); subscriptions[0].customer.email = 'someone-else@example.com';
  await assert.rejects(load('src/lib/paystack.ts').cancelCustomerSubscriptions(email, 'SUB_one'), /does not match/);
});

test('non-renewing preserves paid access when cancelled through the Paystack portal', async () => {
  const { subscriptions } = paystack(); subscriptions[0].status = 'non-renewing';
  const { rows, mocks } = database('active');
  await load('src/lib/membership-sync.ts', mocks).syncVendorSubscription('uid', email);
  assert.equal(rows['vendors/uid'].membershipStatus, 'active');
  assert.equal(rows['vendors/uid'].subscriptionRenews, false);
});

test('plan change webhook stops the old plan and activates the replacement without a browser callback', async () => {
  const { subscriptions } = paystack();
  subscriptions.push({ ...subscriptions[0], subscription_code: 'SUB_featured', plan: { plan_code: 'PLN_featured' } });
  const { rows, mocks } = database('active');
  const res = await load('src/app/api/paystack/webhook/route.ts', mocks).POST(webhook({ amount: 119900, currency: 'ZAR', reference: 'initial',
    metadata: { uid: 'uid', applicationId: 'app', tier: 'featured', changePlan: true, previousSubscriptionCode: 'SUB_one' }, customer: { email } }));
  assert.equal(res.status, 200);
  assert.equal(subscriptions[0].status, 'non-renewing');
  assert.equal(rows['vendorApplications/app'].selectedPlan, 'featured');
  assert.equal(rows['vendors/uid'].paystackSubscriptionCode, 'SUB_featured');
});

for (const applicationStatus of ['approved', 'cancelled']) test(`verified browser callback respects ${applicationStatus} application`, async () => {
  const { rows, mocks } = database('pending_payment', applicationStatus);
  mocks['@/lib/paystack'] = {
    TIER_AMOUNTS: { standard: 49900 },
    verifyTransaction: async () => ({ success: true, tier: 'standard', customerEmail: email, amount: 49900, currency: 'ZAR', reference: 'initial',
      metadata: { uid: 'uid', applicationId: 'app' } }),
  };
  const res = await load('src/app/api/paystack/verify/route.ts', mocks).POST(request({ reference: 'initial' }));
  assert.equal(res.status, applicationStatus === 'approved' ? 200 : 403);
  assert.equal(rows['vendors/uid'].membershipStatus, applicationStatus === 'approved' ? 'active' : 'pending_payment');
});
