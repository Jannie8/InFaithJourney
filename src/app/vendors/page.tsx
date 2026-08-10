
"use client";

import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Wallet, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { CORE_VENDORS } from '@/app/page';
import { ELITE_VENDORS, CURATED_VENDORS } from '@/lib/vendors';

const FILTER_LOCATIONS = ['Cape Town', 'Stellenbosch', 'Franschhoek', 'Johannesburg', 'Pretoria'];

// Turn a URL slug (e.g. "cape-town") into a display name ("Cape Town").
function prettifyLocation(slug: string) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function VendorsPageInner() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-venues');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [budget, setBudget] = useState([0, 200]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'elite' | 'curated'>('elite');

  // Seed the filters from whatever was submitted on the homepage search bar
  // (?location=cape-town, ?category=venues). This is what makes the homepage
  // "Find Vendors" button actually filter the results here.
  useEffect(() => {
    setIsLoaded(true);
    const loc = searchParams.get('location');
    const cat = searchParams.get('category');
    if (loc) {
      const pretty = prettifyLocation(loc);
      setSelectedLocations([pretty]);
    }
    if (cat) {
      const match = CORE_VENDORS.find(v => v.name.toLowerCase() === cat.toLowerCase());
      if (match) {
        setSelectedCategory(match.name);
        // Elite only stocks a few categories. If the searched category has no
        // Elite vendors, open on Curated so the user still sees results
        // (the per-category experts) instead of an empty page.
        const eliteHasCategory = ELITE_VENDORS.some(v => v.category === match.name);
        if (!eliteHasCategory) setViewMode('curated');
      }
    }
  }, [searchParams]);

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedCategory('');
    setSearchText('');
    setBudget([0, 200]);
    router.replace('/vendors');
  };

  // The view toggle picks which collection we're browsing. The same sidebar
  // filters (category / location / budget / search) then apply on top of it,
  // and the two collections never mix.
  const displayed = useMemo(() => {
    const source = viewMode === 'curated' ? CURATED_VENDORS : ELITE_VENDORS;
    const base = source.filter(v => {
      // Category
      if (selectedCategory && v.category !== selectedCategory) return false;
      // Location (any selected match)
      if (selectedLocations.length > 0 && !selectedLocations.includes(v.location)) return false;
      // Budget range (price stored in thousands)
      if (v.price < budget[0] || v.price > budget[1]) return false;
      // Free-text search across name / category / location
      if (searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        const haystack = `${v.name} ${v.category} ${v.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return [...base].sort((a, b) =>
      viewMode === 'curated' ? b.reviews - a.reviews : b.rating - a.rating
    );
  }, [viewMode, selectedCategory, selectedLocations, budget, searchText]);

  const hasActiveFilters =
    selectedCategory !== '' ||
    selectedLocations.length > 0 ||
    searchText.trim() !== '' ||
    budget[0] !== 0 ||
    budget[1] !== 200;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Search Hero */}
      <section className="relative h-[45vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden px-4">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Golden hour wedding venue"
          fill
          className={`object-cover sepia-overlay brightness-[0.6] transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority
          data-ai-hint="wedding venue"
        />
        <div className="absolute inset-0 luxury-gradient-overlay opacity-85"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-56 md:pt-0 w-full">
          <h1 className="text-[32px] md:text-[60px] font-headline text-white mb-6 md:mb-10 drop-shadow-2xl">Find Your Elite Vendor</h1>
          <div className="relative w-full max-w-2xl mx-auto group">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-full pl-12 md:pl-14 h-14 md:h-16 border-none bg-white text-[15px] md:text-[17px] shadow-2xl focus-visible:ring-secondary/30"
              placeholder="Search by name, category or style..."
            />
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 md:w-6 h-5 md:h-6 text-primary" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">

          <aside className="lg:col-span-1">
             <div className="lg:hidden mt-8 mb-6">
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
              <div className="hidden lg:flex items-center justify-between mb-8 border-b border-primary/10 pb-4">
                <h3 className="font-headline text-[28px]">Refine Results</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <Accordion type="multiple" defaultValue={['categories', 'location', 'budget']} className="space-y-8 md:space-y-10">
                <AccordionItem value="categories" className="border-none">
                   <AccordionTrigger className="text-[12px] md:text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline">Browse Categories</AccordionTrigger>
                   <AccordionContent className="pt-4 space-y-1.5">
                    {/* "All Categories" resets the category filter in one click */}
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={cn(
                        "flex items-center justify-between w-full group py-1.5 px-2 rounded-lg transition-colors text-[14px] md:text-[15px] font-medium",
                        selectedCategory === '' ? "bg-primary/5 text-primary" : "hover:text-primary"
                      )}
                    >
                      All Categories
                      {selectedCategory === '' && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                    </button>
                    {CORE_VENDORS.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={cn(
                          "flex items-center justify-between w-full group py-1.5 px-2 rounded-lg transition-colors text-[14px] md:text-[15px] font-medium text-left",
                          selectedCategory === cat.name ? "bg-primary/5 text-primary" : "hover:text-primary"
                        )}
                      >
                        {cat.name}
                        {selectedCategory === cat.name
                          ? <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          : <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
                      </button>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="location" className="border-none">
                  <AccordionTrigger className="text-[12px] md:text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4 md:space-y-6">
                    <div>
                      <div className="space-y-3">
                        {FILTER_LOCATIONS.map(loc => (
                          <div key={loc} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox
                              id={`loc-sa-${loc}`}
                              checked={selectedLocations.includes(loc)}
                              onCheckedChange={() => toggleLocation(loc)}
                              className="rounded-md border-primary/30 w-5 h-5 data-[state=checked]:bg-secondary transition-all"
                            />
                            <label htmlFor={`loc-sa-${loc}`} className="text-[14px] md:text-[15px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/85">{loc}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="budget" className="border-none">
                  <AccordionTrigger className="text-[12px] md:text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Budget Range
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6">
                    <div className="mb-4 flex flex-col gap-1">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Estimated Range</p>
                      <p className="text-[14px] font-headline font-bold text-primary italic">
                        R{(budget[0] * 1000).toLocaleString()} — R{(budget[1] * 1000).toLocaleString()}
                      </p>
                    </div>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={200}
                      min={0}
                      step={5}
                      className="py-2"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-5">
              <h2 className="font-headline text-[28px] md:text-[42px]">
                {viewMode === 'curated' ? 'Curated Selections' : 'Elite Selections'}
              </h2>
              <div className="flex flex-col items-start md:items-end gap-3">
                {/* Elite / Curated view toggle */}
                <div className="inline-flex rounded-full border border-primary/15 bg-white/60 p-1">
                  <button
                    onClick={() => setViewMode('elite')}
                    className={cn(
                      "px-4 md:px-5 py-1.5 rounded-full text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-all",
                      viewMode === 'elite' ? "bg-primary text-white shadow-sm" : "text-primary hover:bg-primary/5"
                    )}
                  >
                    Elite Selections
                  </button>
                  <button
                    onClick={() => setViewMode('curated')}
                    className={cn(
                      "px-4 md:px-5 py-1.5 rounded-full text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-all",
                      viewMode === 'curated' ? "bg-primary text-white shadow-sm" : "text-primary hover:bg-primary/5"
                    )}
                  >
                    Curated Selections
                  </button>
                </div>
                <p className="text-[14px] md:text-[15.5px] text-muted-foreground italic font-medium">
                  {displayed.length} {displayed.length === 1 ? 'vendor' : 'vendors'} matching your search
                </p>
              </div>
            </div>

            {/* Active filter chips — one-tap removal, plus "Clear all" to return
                to the full list without back-stepping. */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory('')} className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/15 text-primary rounded-full px-3.5 py-1.5 text-[12px] font-bold hover:bg-primary/10 transition-colors">
                    {selectedCategory}<X className="w-3.5 h-3.5" />
                  </button>
                )}
                {selectedLocations.map(loc => (
                  <button key={loc} onClick={() => toggleLocation(loc)} className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/15 text-primary rounded-full px-3.5 py-1.5 text-[12px] font-bold hover:bg-primary/10 transition-colors">
                    {loc}<X className="w-3.5 h-3.5" />
                  </button>
                ))}
                <button onClick={clearAllFilters} className="inline-flex items-center gap-1.5 text-secondary hover:text-primary rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-widest transition-colors">
                  Clear All
                </button>
              </div>
            )}

            {displayed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                {displayed.map(vendor => (
                  <VendorCard key={vendor.id} {...vendor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-primary/10 rounded-[24px] bg-white/40">
                <p className="font-headline text-[22px] md:text-[26px] text-primary mb-3 italic">No vendors match your filters</p>
                <p className="text-[14px] md:text-[15px] text-muted-foreground mb-8 max-w-md mx-auto">
                  {viewMode === 'curated'
                    ? 'No curated vendors match these filters yet — try Elite Selections for the full collective.'
                    : 'Try widening your budget or removing a location to see more of our curated collective.'}
                </p>
                <Button onClick={clearAllFilters} className="button-rose h-12 px-8 text-[12px] font-bold tracking-[0.15em] uppercase">
                  Show All Vendors
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={null}>
      <VendorsPageInner />
    </Suspense>
  );
}
