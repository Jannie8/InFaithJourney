const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { load } = require('./helpers/load-typescript.cjs');
const app = initializeApp({ projectId: 'demo-infaithjourney', apiKey: 'fake-key', storageBucket: 'demo-infaithjourney.appspot.com' }, 'approval-tests');
const db = getFirestore(app);
const vendor = { id: 'uid', applicationId: 'approved-app', membershipTier: 'free', membershipStatus: 'active' };
const application = { id: 'approved-app', submitterUid: 'uid', selectedPlan: 'free', applicationStatus: 'approved', businessName: 'Approved Business', createdAt: { seconds: 1 } };

function dashboard(tab, applications, linked = null, overrides = {}) {
  const wrapper = ({ children }) => React.createElement('div', null, children);
  const mocks = {
    react: { ...React, useState: value => React.useState(value === 'Overview' ? tab : value) },
    '@/firebase': {
      useUser: () => ({ user: { uid: 'uid', email: 'vendor@example.com' }, isUserLoading: false }),
      useAuth: () => ({}), useFirestore: () => db, useFirebaseApp: () => app,
      useMemoFirebase: factory => factory(),
      useCollection: q => q?._query?.path?.canonicalString() === 'vendorApplications' ? applications : { data: [], isLoading: false, error: null },
      useDoc: ref => ref?.path === 'vendors/uid' ? { data: vendor, isLoading: false, error: null }
        : ref?.path === 'vendorApplications/approved-app' ? { data: linked, isLoading: false, error: null }
        : { data: null, isLoading: false, error: null },
    },
    '@/components/layout/Navbar': { Navbar: () => null }, '@/components/layout/Footer': { Footer: () => null },
    '@/hooks/use-toast': { useToast: () => ({ toast() {} }) },
    'next/link': { __esModule: true, default: ({ children, href }) => React.createElement('a', { href }, children) },
    'lucide-react': new Proxy({}, { get: () => () => null }),
    ...overrides,
  };
  for (const [file, names] of Object.entries({ button: ['Button'], input: ['Input'], label: ['Label'], card: ['Card','CardContent','CardHeader','CardTitle','CardDescription'], checkbox: ['Checkbox'], badge: ['Badge'], textarea: ['Textarea'] })) {
    mocks[`@/components/ui/${file}`] = Object.fromEntries(names.map(name => [name, wrapper]));
  }
  return renderToStaticMarkup(React.createElement(load('src/app/dashboard/page.tsx', mocks).default));
}

test('public approval and payment links never use the server bind address', () => {
  const { publicSiteUrl } = load('src/lib/site-url.ts');
  const before = process.env.SITE_URL; delete process.env.SITE_URL;
  try {
    assert.equal(publicSiteUrl('/dashboard#activate-membership'), 'https://infaithjourney.com/dashboard#activate-membership');
    assert.equal(publicSiteUrl('/dashboard?paystack=return'), 'https://infaithjourney.com/dashboard?paystack=return');
    process.env.SITE_URL = 'https://0.0.0.0:8080';
    assert.throws(() => publicSiteUrl('/dashboard'), /public HTTPS/);
    process.env.SITE_URL = 'https://infaithjourney.com';
    assert.throws(() => publicSiteUrl('https://other.example/dashboard'), /stay on/);
  } finally { if (before === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = before; }
});

for (const tier of ['free','standard','featured']) test(`${tier} approval email links to the correct public dashboard destination`, async () => {
  let email;
  const { sendVendorApprovalEmail } = load('src/lib/vendor-approval-email.ts', { '@/lib/resend': { sendEmail: async message => { email = message; } } });
  const destination = tier === 'free' ? '/dashboard#vendor-profile' : '/dashboard#activate-membership';
  await sendVendorApprovalEmail({ to: 'vendor@example.com', selectedPlan: tier, activationUrl: `https://infaithjourney.com${destination}` });
  assert.match(email.html, new RegExp(`href="https://infaithjourney.com${destination}"`));
  if (tier === 'free') {
    assert.match(email.html, /already active/); assert.match(email.text, /already active/);
    assert.doesNotMatch(email.html, /Activate your plan|final step is to activate/);
  } else assert.match(email.html, /Activate your plan/);
});

test('owner application query is bounded and UID-filtered for deployed rules', () => {
  const { vendorApplicationsQuery } = load('src/lib/vendor-dashboard.ts');
  const query = vendorApplicationsQuery(db, 'uid');
  assert.equal(query._query.limit, 100);
  assert.equal(query._query.filters[0].field.canonicalString(), 'submitterUid');
  assert.equal(query._query.filters[0].value.stringValue, 'uid');
});

test('approved vendor sees their real profile from the private application', () => {
  const html = dashboard('My Profile', { data: [application], isLoading: false, error: null });
  assert.match(html, /Approved Business/); assert.doesNotMatch(html, /No profile yet|Apply as a Vendor/);
});

test('linked application restores profile when list access fails', () => {
  const html = dashboard('My Profile', { data: null, isLoading: false, error: Error('permission-denied') }, application);
  assert.match(html, /Approved Business/); assert.doesNotMatch(html, /No profile yet|Apply as a Vendor/);
});

test('failed application read is an error, never an invitation to apply again', () => {
  const html = dashboard('My Profile', { data: null, isLoading: false, error: Error('permission-denied') });
  assert.match(html, /couldn’t load your vendor profile/); assert.doesNotMatch(html, /No profile yet|Apply as a Vendor/);
});

test('application loading does not show a false missing profile', () => {
  const html = dashboard('My Profile', { data: null, isLoading: true, error: null });
  assert.match(html, /Loading your vendor profile/); assert.doesNotMatch(html, /No profile yet|Apply as a Vendor/);
});

test('free membership never claims monthly billing or offers paid billing controls', () => {
  const html = dashboard('Subscription & Billing', { data: [application], isLoading: false, error: null });
  assert.match(html, /Free Listing is active/); assert.doesNotMatch(html, /Standard Vendor subscription|billing monthly|Manage Billing/);
});

test('application selection rejects another account and preserves most recent own application', () => {
  const { selectVendorApplication } = load('src/lib/vendor-dashboard.ts');
  assert.equal(selectVendorApplication(null, { ...application, submitterUid: 'other' }, 'uid'), null);
  const newest = { ...application, id: 'newest', createdAt: { seconds: 2 } };
  assert.equal(selectVendorApplication([newest], application, 'uid').id, 'newest');
});

for (const tier of ['free', 'standard', 'featured']) test(`approval API behind internal host creates ${tier} listing and a public email URL`, async () => {
  const writes = [];
  let sent;
  const source = { ...application, selectedPlan: tier, applicationStatus: 'pending', email: 'vendor@example.com' };
  const applicationRef = { get: async () => ({ exists: true, id: 'approved-app', data: () => source }), update: async data => writes.push(data) };
  const fakeDb = { collection: name => ({ doc: id => name === 'roles_admin'
    ? { get: async () => ({ exists: true }) } : name === 'vendorApplications' ? applicationRef : { id } }),
    batch: () => ({ update: (_, data) => writes.push(data), set: (_, data) => writes.push(data), commit: async () => {} }) };
  const route = load('src/app/api/admin/vendor-applications/[id]/decision/route.ts', {
    '@/lib/firebase-admin': { getAdminDb: () => fakeDb, getAdminAuth: () => ({ verifyIdToken: async () => ({ uid: 'admin' }) }) },
    '@/lib/vendor-approval-email': { sendVendorApprovalEmail: async input => { sent = input; } },
    'firebase-admin/firestore': { FieldValue: { serverTimestamp: () => 'timestamp' } },
  });
  const req = new Request('https://0.0.0.0:8080/api/admin/vendor-applications/approved-app/decision', {
    method: 'POST', headers: { authorization: 'Bearer test', 'Content-Type': 'application/json' }, body: JSON.stringify({ decision: 'approved' }),
  });
  const res = await route.POST(req, { params: Promise.resolve({ id: 'approved-app' }) });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).emailSent, true);
  assert.equal(sent.activationUrl, `https://infaithjourney.com/dashboard#${tier === 'free' ? 'vendor-profile' : 'activate-membership'}`);
  const listing = writes.find(data => data.membershipTier);
  assert.equal(listing.membershipTier, tier);
  assert.equal(listing.membershipStatus, tier === 'free' ? 'active' : 'awaiting_payment');
});
