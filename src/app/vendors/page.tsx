"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Users, Wallet, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { CORE_VENDORS } from '@/app/page';

const ALL_VENDORS = [
  { id: '1', name: 'Evergold Photography', location: 'Johannesburg', rating: 4.9, reviews: 120, category: 'Photography & Videography', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '', imageHint: 'wedding couple glow' },
  { id: '2', name: 'Misty Vineyards', location: 'Stellenbosch', rating: 5.0, reviews: 85, category: 'Venues', imageUrl: PlaceHolderImages.find(img => img.id === 'hero-venues')?.imageUrl || '', imageHint: 'wedding venue sunset' },
  { id: '3', name: 'Nearby Bridal', location: 'Cape Town', rating: 4.7, reviews: 45, category: 'Fashion', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '', imageHint: 'wedding dress warm' },
  { id: '4', name: 'Rosa Melia', location: 'Cape Town', rating: 5.0, reviews: 32, category: 'Flowers & Decor', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-floral')?.imageUrl || '', imageHint: 'wedding floral arch' },
  { id: '5', name: 'Sunstone Manor', location: 'Stellenbosch', rating: 5.0, reviews: 210, category: 'Venues', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '', imageHint: 'wedding estate lights' },
];

export default function VendorsPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-venues');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen watercolor-bg overflow-x-hidden">
      <Navbar />
      
      {/* Search Hero - Responsive */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden px-4">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Golden hour wedding venue"
          fill
          className="object-cover sepia-overlay brightness-[0.6]"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-[38px] md:text-[60px] font-headline text-white mb-6 md:mb-10 drop-shadow-2xl">Find Your Elite Vendor</h1>
          <div className="relative w-full max-w-2xl mx-auto group">
            <Input className="rounded-full pl-14 h-14 md:h-16 border-none bg-white text-[16px] md:text-[17px] shadow-2xl focus-visible:ring-secondary/30" placeholder="Search by name, category or style..." />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Advanced Filters Sidebar - Responsive Adaptive */}
          <aside className="lg:col-span-1">
             <div className="lg:hidden mb-6">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full h-12 rounded-xl border-primary/20 text-primary flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[13px]">Refine Selection</span>
                </div>
              </Button>
            </div>

            <div className={cn(
              "bg-white/40 p-8 rounded-[32px] border border-primary/10 lg:block lg:sticky lg:top-32 transition-all",
              !isFilterOpen && "hidden"
            )}>
              <h3 className="hidden lg:block font-headline text-[28px] mb-8 border-b border-primary/10 pb-4">Refine Results</h3>
              
              <Accordion type="multiple" defaultValue={['categories', 'location']} className="space-y-10">
                {/* Categories Links */}
                <AccordionItem value="categories" className="border-none">
                   <AccordionTrigger className="text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline">Browse Categories</AccordionTrigger>
                   <AccordionContent className="pt-4 space-y-3.5">
                    {CORE_VENDORS.map(cat => (
                      <Link 
                        key={cat.name} 
                        href={cat.href}
                        className="flex items-center justify-between group py-1 hover:text-primary transition-colors text-[15px] font-medium"
                      >
                        {cat.name}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Location */}
                <AccordionItem value="location" className="border-none">
                  <AccordionTrigger className="text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Service Location
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-3.5">
                    {['Cape Town', 'Stellenbosch', 'Johannesburg', 'Pretoria', 'Garden Route'].map(loc => (
                      <div key={loc} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={`loc-${loc}`} className="rounded-md border-primary/30 w-5 h-5 data-[state=checked]:bg-secondary transition-all" />
                        <label htmlFor={`loc-${loc}`} className="text-[15px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/85">{loc}</label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Budget */}
                <AccordionItem value="budget" className="border-none">
                  <AccordionTrigger className="text-[13.5px] font-bold uppercase tracking-widest text-primary hover:no-underline flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Budget Range
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6">
                    <div className="flex justify-between items-center text-[13px] font-bold text-foreground/60 mb-4">
                      <span>R5k</span>
                      <span>R100k+</span>
                    </div>
                    <Slider defaultValue={[40]} max={100} step={1} className="py-2" />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          {/* Vendors grid - Responsive Columns */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
              <h2 className="font-headline text-[32px] md:text-[42px]">Elite Selections</h2>
              <p className="text-[15.5px] text-muted-foreground italic font-medium">85 premium vendors matching your refined search</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
              {ALL_VENDORS.map(vendor => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
