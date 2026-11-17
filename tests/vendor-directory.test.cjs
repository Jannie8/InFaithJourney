const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { load } = require('./helpers/load-typescript.cjs');
const { parseVendorPriceRange, matchesVendorBudget } = load('src/lib/vendor-pricing.ts');
const { vendorFromFirestore } = load('src/lib/vendors.ts');

for (const [input, min, max] of [
  ['5000 - 10, 000', 5000, 10000], ['R5,000 – R10,000', 5000, 10000],
  ['R5 000 to R10 000', 5000, 10000], ['R5.000–R10.000', 5000, 10000],
  ['R5k - R10k', 5000, 10000], ['R5–10k', 5000, 10000],
  ['R5000–10k', 5000, 10000], ['R1.5k–2.5k', 1500, 2500],
  ['R499.99', 499.99, 499.99], ['R499,99', 499.99, 499.99],
  ['R1,000', 1000, 1000], ['R750', 750, 750],
  ['From R10,000', 10000, 10000], [10000, 10000, 10000], ['Free', 0, 0],
]) test(`parses ZAR pricing: ${input}`, () => assert.deepEqual(parseVendorPriceRange(input), { min, max }));
for (const input of ['', undefined, 'Price on request', 'Negotiable']) test(`keeps unknown price unspecified: ${input}`, () => {
  assert.equal(parseVendorPriceRange(input), null);
  const vendor = vendorFromFirestore('id', { pricingRange: input });
  assert.equal(vendor.priceKnown, false);
  assert.equal(matchesVendorBudget(vendor, [0, 200], 200), true);
});

test('real reported range stays visible and overlaps a chosen budget', () => {
  const vendor = vendorFromFirestore('active-test', { pricingRange: '5000 - 10, 000' });
  assert.equal(vendor.price, 5); assert.equal(vendor.priceMax, 10);
  assert.equal(matchesVendorBudget(vendor, [0, 200], 200), true);
  assert.equal(matchesVendorBudget(vendor, [6, 7], 200), true);
  assert.equal(matchesVendorBudget(vendor, [20, 40], 200), false);
});
test('default catalogue does not hide vendors priced above the slider maximum', () => {
  const vendor = vendorFromFirestore('id', { pricingRange: 'R350,000' });
  assert.equal(matchesVendorBudget(vendor, [0, 200], 200), true);
  assert.equal(matchesVendorBudget(vendor, [50, 200], 200), true);
  assert.equal(matchesVendorBudget(vendor, [0, 300], 300), true);
  assert.equal(matchesVendorBudget(vendor, [0, 100], 200), false);
});

function renderDirectory({ page = 'directory', tier = 'free', view = 'elite', status = 'active', budget, error = null, loading = false } = {}) {
  let emptyStrings = 0;
  const wrapper = ({ children }) => React.createElement('div', null, children);
  const mocks = {
    react: { ...React, use: () => ({ slug: 'planning-coordination' }), useState: value => {
      if (value === 'elite') value = view;
      if (value === '' && page === 'directory' && emptyStrings++ === 0) value = 'Test';
      if (Array.isArray(value) && value.length === 2 && budget) value = budget;
      return React.useState(value);
    } },
    '@/app/page': { CORE_VENDORS: [{ name: 'Planning' }] },
    '@/firebase': { useFirestore: () => null, useMemoFirebase: factory => factory(), useCollection: () => ({
      data: error ? null : [{ id: 'active-test', name: 'Test', businessName: 'Test', membershipStatus: status,
        membershipTier: tier, pricingRange: '5000 - 10, 000', location: 'Gauteng', categorySlug: 'planning-coordination' }],
      error, isLoading: loading,
    }) },
    '@/components/layout/Navbar': { Navbar: () => null }, '@/components/layout/Footer': { Footer: () => null },
    '@/components/vendors/VendorCard': { VendorCard: props => React.createElement('article', { 'data-vendor-id': props.id }, props.name) },
    'next/navigation': { useSearchParams: () => new URLSearchParams(), useRouter: () => ({ replace() {}, push() {} }) },
    'next/image': { __esModule: true, default: () => null },
    'next/link': { __esModule: true, default: wrapper },
    'lucide-react': new Proxy({}, { get: () => () => null }),
  };
  for (const [file, names] of Object.entries({ button: ['Button'], input: ['Input'], checkbox: ['Checkbox'], slider: ['Slider'],
    accordion: ['Accordion','AccordionContent','AccordionItem','AccordionTrigger'], select: ['Select','SelectContent','SelectItem','SelectTrigger','SelectValue'] })) {
    mocks[`@/components/ui/${file}`] = Object.fromEntries(names.map(name => [name, wrapper]));
  }
  const file = page === 'directory' ? 'src/app/vendors/page.tsx' : 'src/app/category/[slug]/page.tsx';
  return renderToStaticMarkup(React.createElement(load(file, mocks).default, page === 'category' ? { params: Promise.resolve({ slug: 'planning-coordination' }) } : {}));
}
for (const view of ['elite','curated']) for (const tier of ['free','standard','featured']) test(`search finds active ${tier} vendor in ${view}`, () => {
  const html = renderDirectory({ tier, view });
  assert.match(html, /data-vendor-id="active-test"/); assert.doesNotMatch(html, /No vendors match/);
});
test('category page also includes the reported vendor', () => {
  assert.match(renderDirectory({ page: 'category' }), /data-vendor-id="active-test"/);
});
test('inactive memberships stay out of search results', () => {
  assert.doesNotMatch(renderDirectory({ status: 'inactive' }), /data-vendor-id="active-test"/);
});
test('explicit budget excludes a vendor whose advertised range does not overlap', () => {
  assert.doesNotMatch(renderDirectory({ budget: [20, 30] }), /data-vendor-id="active-test"/);
});
test('read failure is not silently presented as an empty search', () => {
  const html = renderDirectory({ error: Error('unavailable') });
  assert.match(html, /couldn’t load community vendors/); assert.doesNotMatch(html, /No vendors match/);
});
