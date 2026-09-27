import { PlaceHolderImages } from '@/lib/placeholder-images';

export interface Vendor {
  id: string;
  name: string;
  location: string;
  price: number; // in thousands of Rand, used by the budget slider
  rating: number;
  reviews: number;
  category: string;
  categorySlug: string;
  imageUrl: string;
  imageHint: string;
}

const CATEGORY_NAMES_BY_SLUG: Record<string, string> = {
  venues: 'Venues',
  'photography-videography': 'Photography',
  beauty: 'Beauty',
  'flowers-decor': 'Flowers',
  catering: 'Catering',
  'honeymoon-destinations': 'Travel',
  'music-entertainment': 'Music',
  'planning-coordination': 'Planning',
  fashion: 'Fashion',
  stationery: 'Stationery',
  'wedding-cakes': 'Cakes',
  jewelry: 'Jewelry',
};

/** Convert a public Firestore vendor document into the shared card shape. */
export function vendorFromFirestore(id: string, data: Record<string, any>): Vendor & { membershipTier?: string } {
  const categorySlug = data.categorySlug || 'vendors';
  const parsedPrice = Number(String(data.pricingRange ?? '').replace(/[^0-9.]/g, ''));
  return {
    id,
    name: data.name || data.businessName || 'Unnamed Business',
    location: data.location || 'South Africa',
    price: Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice / (parsedPrice > 1_000 ? 1_000 : 1) : 100,
    rating: typeof data.rating === 'number' ? data.rating : 5,
    reviews: typeof data.reviews === 'number' ? data.reviews : 0,
    category: CATEGORY_NAMES_BY_SLUG[categorySlug] || data.category || 'Vendors',
    categorySlug,
    imageUrl: data.imageUrl || data.coverImageUrl || data.logoUrl || '/wedding.png',
    imageHint: data.imageHint || `${data.category || 'wedding'} vendor`,
    membershipTier: data.membershipTier,
  };
}

// The canonical category list. `name` must match the labels used in
// CORE_VENDORS (homepage) so sidebar filtering lines up; `slug` matches the
// /category/[slug] route segments.
export const VENDOR_CATEGORIES: { name: string; slug: string }[] = [
  { name: 'Venues', slug: 'venues' },
  { name: 'Photography', slug: 'photography-videography' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Flowers', slug: 'flowers-decor' },
  { name: 'Catering', slug: 'catering' },
  { name: 'Travel', slug: 'honeymoon-destinations' },
  { name: 'Music', slug: 'music-entertainment' },
  { name: 'Planning', slug: 'planning-coordination' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Stationery', slug: 'stationery' },
  { name: 'Cakes', slug: 'wedding-cakes' },
  { name: 'Jewelry', slug: 'jewelry' },
];

// ELITE and CURATED are two completely separate collections — a vendor in one
// never appears in the other.
export const ELITE_VENDORS: Vendor[] = [
  { id: '1', name: 'Evergold Photography', location: 'Johannesburg', price: 35, rating: 4.9, reviews: 120, category: 'Photography', categorySlug: 'photography-videography', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '', imageHint: 'wedding couple glow' },
  { id: '2', name: 'Misty Vineyards', location: 'Stellenbosch', price: 120, rating: 5.0, reviews: 85, category: 'Venues', categorySlug: 'venues', imageUrl: PlaceHolderImages.find(img => img.id === 'hero-venues')?.imageUrl || '', imageHint: 'wedding venue sunset' },
  { id: '3', name: 'Nearby Bridal', location: 'Cape Town', price: 28, rating: 4.7, reviews: 45, category: 'Fashion', categorySlug: 'fashion', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '', imageHint: 'wedding dress warm' },
  { id: '4', name: 'Rosa Melia', location: 'Cape Town', price: 18, rating: 5.0, reviews: 32, category: 'Flowers', categorySlug: 'flowers-decor', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-floral')?.imageUrl || '', imageHint: 'wedding floral arch' },
  { id: '5', name: 'Sunstone Manor', location: 'Stellenbosch', price: 150, rating: 5.0, reviews: 210, category: 'Venues', categorySlug: 'venues', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '', imageHint: 'wedding estate lights' },
];

const CURATED_LOCATIONS = ['Cape Town', 'Stellenbosch', 'Franschhoek', 'Johannesburg', 'Pretoria'];

// The Curated collection covers EVERY category — the per-category experts that
// appear when browsing a category. Generated so no category is ever empty.
export const CURATED_VENDORS: Vendor[] = VENDOR_CATEGORIES.flatMap((cat) =>
  [1, 2, 3, 4, 5, 6].map((i) => ({
    id: `curated-${cat.slug}-${i}`,
    name: `${cat.name} Expert ${i}`,
    location: CURATED_LOCATIONS[i % CURATED_LOCATIONS.length],
    price: 20 + i * 25, // R45k .. R170k
    rating: Math.min(5.0, 4.8 + i * 0.02),
    reviews: 12 * i + 20,
    category: cat.name,
    categorySlug: cat.slug,
    imageUrl: `https://picsum.photos/seed/inf-curated-${cat.slug}-${i}/800/600`,
    imageHint: `${cat.name} wedding luxury`,
  }))
);

/** Look up any vendor (elite or curated) by its id. */
export function getVendorById(id: string): Vendor | undefined {
  return [...ELITE_VENDORS, ...CURATED_VENDORS].find(v => v.id === id);
}

/** All curated vendors for a given category route slug. */
export function getCuratedByCategorySlug(slug: string): Vendor[] {
  return CURATED_VENDORS.filter(v => v.categorySlug === slug);
}
