"use client";

import { use } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Wallet, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORY_MAP: Record<string, { name: string; title: string; imageId: string; description: string }> = {
  'venues': {
    name: 'Venues',
    title: 'Luxury Wedding Venues',
    imageId: 'hero-venues',
    description: 'Find the perfect setting for your vows, from mountain estates to coastal retreats.'
  },
  'photography-videography': {
    name: 'Photography & Videography',
    title: 'Exquisite Photography',
    imageId: 'vendor-evergold',
    description: 'Capture every golden moment forever with South Africa\'s finest visual storytellers.'
  },
  'beauty': {
    name: 'Beauty',
    title: 'Bridal Beauty & Wellness',
    imageId: 'gallery-3',
    description: 'Radiate elegance on your special day with expert makeup artists and stylists.'
  },
  'flowers-decor': {
    name: 'Flowers & Decor',
    title: 'Floral Artistry & Decor',
    imageId: 'vendor-floral',
    description: 'Transform your venue with lush floral installations and bespoke event styling.'
  },
  'catering': {
    name: 'Catering',
    title: 'Fine Dining & Catering',
    imageId: 'gallery-2',
    description: 'Delight your guests with curated menus and exceptional culinary experiences.'
  },
  'honeymoon-destinations': {
    name: 'Honeymoon Destinations',
    title: 'Romantic Escapes',
    imageId: 'gallery-5',
    description: 'Start your journey together in the most breathtaking destinations around the globe.'
  },
  'music-entertainment': {
    name: 'Music & Entertainment',
    title: 'Symphonies & Celebration',
    imageId: 'gallery-4',
    description: 'Create the perfect atmosphere with soulful performers and world-class entertainment.'
  },
  'planning-coordination': {
    name: 'Planning & Coordination',
    title: 'Bespoke Planning',
    imageId: 'hero-apply',
    description: 'Relax as elite coordinators bring your romantic vision to life with precision.'
  },
  'fashion': {
    name: 'Fashion',
    title: 'Couture & Bridal Fashion',
    imageId: 'vendor-bridal',
    description: 'Discover the gown of your dreams from curated high-end designers and boutiques.'
  },
  'stationery': {
    name: 'Stationery',
    title: 'Fine Paper & Stationery',
    imageId: 'gallery-1',
    description: 'Set the tone for your celebration with elegantly crafted invitations and paper goods.'
  },
  'wedding-cakes': {
    name: 'Wedding Cakes',
    title: 'Bespoke Wedding Cakes',
    imageId: 'gallery-6',
    description: 'Celebrate your union with a masterpiece of confectionery art and flavor.'
  },
  'jewelry': {
    name: 'Jewelry',
    title: 'Fine Jewelry & Gems',
    imageId: 'vendor-bridal',
    description: 'Adorn your love with timeless symbols of commitment and exquisite craftsmanship.'
  }
};

const SA_LOCATIONS = ['Cape Town', 'Stellenbosch', 'Franschhoek', 'Johannesburg', 'Pretoria', 'Garden Route'];

export default function CategoryBrowsePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = CATEGORY_MAP[slug] || {
    name: 'Vendors',
    title: 'Premium Vendors',
    imageId: 'hero-home',
    description: 'Discover elite vendors for your magical journey.'
  };

  const heroImage = PlaceHolderImages.find(img => img.id === category.imageId);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Breadcrumb Row */}
      <div className="pt-24 md:pt-32 pb-4 px-6 max-w-7xl mx-auto w-full">
        <Link 
          href="/vendors" 
          className="inline-flex items-center gap-2 text-[#C9A96E] hover:opacity-80 transition-opacity text-[11px] md:text-[12px] font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4" />
          Back to All Vendors
        </Link>
      </div>

      {/* Dynamic Category Hero */}
      <section className="relative min-h-[45vh] md:h-[55vh] w-full flex items-center justify-center overflow-hidden px-4">
        <Image
          src={heroImage?.imageUrl || `https://picsum.photos/seed/inf-cat-${slug}/1920/1080`}
          alt={category.title}
          fill
          className="object-cover sepia-overlay brightness-[0.55]"
          priority
          data-ai-hint="wedding hero"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-up pt-44 md:pt-0">
          <h1 className="text-[32px] md:text-[68px] font-headline text-white mb-4 md:mb-6 drop-shadow-2xl leading-tight">{category.title}</h1>
          <p className="text-[15px] md:text-[20px] text-white/90 italic font-medium max-w-2xl mx-auto drop-shadow-md px-4">
            {category.description}
          </p>
          <div className="relative w-full max-w-xl mx-auto mt-8 md:mt-10 group px-4 md:px-0">
            <Input className="rounded-full pl-12 md:pl-14 h-14 md:h-16 border-none bg-white text-[15px] md:text-[16px] shadow-2xl focus-visible:ring-secondary/30" placeholder={`Search ${category.name.toLowerCase()}...`} />
            <Search className="absolute left-8 md:left-6 top-1/2 -translate-y-1/2 w-5 md:w-6 h-5 md:h-6 text-primary" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-14">
          
          {/* Enhanced Category Filters Sidebar */}
          <aside className="lg:col-span-1">
             <div className="lg:hidden mb-6">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full h-12 rounded-xl border-primary/20 text-primary flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[12px]">Refine Selection</span>
                </div>
              </Button>
            </div>

            <div className={cn(
              "p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-primary/10 lg:block lg:sticky lg:top-32 transition-all shadow-sm",
              !isFilterOpen && "hidden"
            )}>
              <h3 className="hidden lg:block font-headline text-[28px] mb-8 border-b border-primary/10 pb-4">Refine Results</h3>
              
              <Accordion type="multiple" defaultValue={['location', 'budget']} className="space-y-8 md:space-y-10">
                {/* Location Filter */}
                <AccordionItem value="location" className="border-none">
                  <AccordionTrigger className="text-[12px] md:text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4 md:space-y-6">
                    <div>
                      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">South Africa</p>
                      <div className="space-y-3">
                        {SA_LOCATIONS.map(loc => (
                          <div key={loc} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox id={`loc-sa-${loc}`} className="rounded-md border-primary/30 w-5 h-5 data-[state=checked]:bg-secondary transition-all" />
                            <label htmlFor={`loc-sa-${loc}`} className="text-[14px] md:text-[15px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/85">{loc}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Budget */}
                <AccordionItem value="budget" className="border-none">
                  <AccordionTrigger className="text-[12px] md:text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Budget Range
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6">
                    <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-10 md:mt-12 p-6 md:p-8 bg-primary/5 rounded-[24px] border border-primary/10 text-center golden-glow-premium">
                <h3 className="font-headline text-[18px] md:text-[22px] mb-4">Run a {category.name} Business?</h3>
                <p className="text-[12px] md:text-[14px] text-muted-foreground mb-6 md:mb-8 italic">Get seen by high-end couples searching for excellence.</p>
                <div className="flex justify-center">
                  <Button asChild className="w-full button-rose h-11 md:h-12 text-[12px] shadow-lg">
                    <Link href="/apply">JOIN AS A VENDOR</Link>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Vendors grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 border-b border-primary/10 pb-6">
              <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                <h2 className="font-headline text-[28px] md:text-[42px]">Curated Selection</h2>
                <div className="w-16 h-1 bg-secondary rounded-full mx-auto md:mx-0"></div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 w-full md:w-auto">
                <p className="text-[14px] md:text-[15.5px] text-muted-foreground italic font-medium whitespace-nowrap">Showing elite {category.name.toLowerCase()} experts</p>
                <Select defaultValue="recommended">
                  <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-full border-primary/20 text-[11px] md:text-[13px] font-bold uppercase tracking-widest">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest Listed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => {
                const roundedRating = 4.8 + (i * 0.02);
                
                return (
                  <VendorCard 
                    key={i} 
                    id={`vendor-${slug}-${i}`}
                    name={`${category.name} Expert ${i}`}
                    location={i % 2 === 0 ? 'Stellenbosch, WC' : 'Cape Town, WC'}
                    rating={Math.min(5.0, roundedRating)}
                    reviews={12 * i + 5}
                    category={category.name}
                    imageUrl={`https://picsum.photos/seed/inf-${slug}-${i}/800/600`}
                    imageHint={`${slug} wedding luxury`}
                  />
                );
              })}
            </div>

            <div className="mt-16 md:mt-20 text-center">
              <Button variant="outline" className="rounded-full px-8 md:px-12 h-12 md:h-14 border-primary/20 text-primary hover:bg-primary/5 uppercase font-bold tracking-[0.2em] text-[11px] md:text-[13px] shadow-sm golden-glow-premium">
                LOAD MORE {category.name.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
