"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import { 
  Home as HomeIcon, Camera, Palette, Flower2, Utensils, Plane, 
  Music, CalendarCheck, Shirt, PenTool, Cake, Gem, Search, SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export const CORE_VENDORS = [
  { name: 'Venues', icon: HomeIcon, href: '/category/venues' },
  { name: 'Photography & Videography', icon: Camera, href: '/category/photography-videography' },
  { name: 'Beauty', icon: Palette, href: '/category/beauty' },
  { name: 'Flowers & Decor', icon: Flower2, href: '/category/flowers-decor' },
  { name: 'Catering', icon: Utensils, href: '/category/catering' },
  { name: 'Honeymoon Destinations', icon: Plane, href: '/category/honeymoon-destinations' },
  { name: 'Music & Entertainment', icon: Music, href: '/category/music-entertainment' },
  { name: 'Planning & Coordination', icon: CalendarCheck, href: '/category/planning-coordination' },
  { name: 'Fashion', icon: Shirt, href: '/category/fashion' },
  { name: 'Stationery', icon: PenTool, href: '/category/stationery' },
  { name: 'Wedding Cakes', icon: Cake, href: '/category/wedding-cakes' },
  { name: 'Jewelry', icon: Gem, href: '/category/jewelry' },
];

const FEATURED_VENDORS = [
  {
    id: 'sunstone-manor',
    name: 'Sunstone Manor',
    location: 'Stellenbosch, WC',
    rating: 5.0,
    reviews: 24,
    category: 'Venues',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '',
    imageHint: 'wedding estate sunset'
  },
  {
    id: 'nearby-bridal',
    name: 'Nearby Bridal',
    location: 'Cape Town, WC',
    rating: 4.8,
    reviews: 18,
    category: 'Fashion',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '',
    imageHint: 'wedding dress warm'
  },
  {
    id: 'evergold-photography',
    name: 'Evergold Photography',
    location: 'Johannesburg, GP',
    rating: 4.9,
    reviews: 42,
    category: 'Photography & Videography',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '',
    imageHint: 'wedding couple glow'
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen watercolor-bg overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section - Fully Responsive */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] w-full overflow-hidden flex items-center justify-center hero-padding px-4">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Golden hour wedding"
          fill
          className="object-cover brightness-[0.5] sepia-overlay"
          priority
          data-ai-hint="wedding sunset lights"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-[42px] sm:text-[54px] md:text-[76px] font-headline text-white mb-6 drop-shadow-xl leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Find Your Perfect Wedding Vendor
          </h1>
          <p className="text-[17px] sm:text-[20px] md:text-[24px] text-white/95 mb-10 md:mb-14 font-medium italic tracking-wide max-w-3xl mx-auto drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Browse curated & trusted vendors for your magical golden-hour South African wedding.
          </p>
          
          {/* Search Bar - Responsive Grid */}
          <div className="bg-white/95 backdrop-blur-2xl p-3 md:p-5 rounded-[28px] md:rounded-[40px] shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 max-w-4xl mx-auto border border-primary/20 animate-in fade-in zoom-in duration-1000 delay-500 golden-glow-premium">
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12 md:h-16 text-[16px] md:text-[17px] font-medium text-foreground/80">
                  <SelectValue placeholder="I'm Looking For..." />
                </SelectTrigger>
                <SelectContent>
                  {CORE_VENDORS.map(v => (
                    <SelectItem key={v.name} value={v.name.toLowerCase()}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full px-4">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12 md:h-16 text-[16px] md:text-[17px] font-medium text-foreground/80">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cape-town">Cape Town</SelectItem>
                  <SelectItem value="stellenbosch">Stellenbosch</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                  <SelectItem value="pretoria">Pretoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" className="w-full md:w-auto h-12 md:h-16 button-rose px-10 md:px-14 text-[15px] md:text-[16px] golden-glow-premium">
              <Search className="w-5 h-5 mr-2" />
              FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Category Icon Tabs - Responsive Slider/Grid */}
      <section className="max-w-7xl mx-auto px-6 section-padding w-full">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-[36px] md:text-[48px] mb-4">Browse by Category</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-secondary to-secondary/50 mx-auto rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
          {CORE_VENDORS.map((v) => (
            <Link key={v.name} href={v.href} className="icon-tab group golden-glow-premium">
              <v.icon className="w-10 h-10 md:w-12 md:h-12 text-primary group-hover:text-secondary transition-all duration-500 group-hover:scale-110" />
              <span className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-center opacity-85">{v.name}</span>
              <div className="mt-2 w-0 h-[2px] bg-secondary group-hover:w-full transition-all duration-500 shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Showcase Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20 md:pb-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Sidebar Filter - Desktop & Mobile Adaptive */}
          <aside className="lg:col-span-1">
            <div className="lg:hidden mb-8">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full h-12 rounded-xl border-primary/20 text-primary flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[13px]">Filter Results</span>
                </div>
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className={cn(
              "bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-primary/10 shadow-sm lg:sticky lg:top-32 transition-all",
              !isFilterOpen && "hidden lg:block"
            )}>
              <h3 className="hidden lg:block font-headline text-[28px] mb-8 border-b border-primary/10 pb-4">Filter Selections</h3>
              
              <Accordion type="single" collapsible defaultValue="categories" className="space-y-6">
                <AccordionItem value="categories" className="border-none">
                  <AccordionTrigger className="text-[13px] font-bold uppercase tracking-widest text-primary/80 hover:no-underline">Core Categories</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    {CORE_VENDORS.slice(0, 8).map((v) => (
                      <div key={v.name} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={v.name} className="rounded-md border-primary/30 w-5 h-5 data-[state=checked]:bg-secondary transition-all" />
                        <label htmlFor={v.name} className="text-[15px] font-medium leading-none cursor-pointer group-hover:text-secondary transition-colors text-foreground/85">{v.name}</label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-none">
                  <AccordionTrigger className="text-[13px] font-bold uppercase tracking-widest text-primary/80 hover:no-underline">Price Range</AccordionTrigger>
                  <AccordionContent className="pt-6">
                    <div className="flex justify-between items-center mb-4 text-[13px] font-bold text-foreground/60">
                      <span>R10k</span>
                      <span>R50k+</span>
                    </div>
                    <Slider defaultValue={[25000]} max={100000} step={1000} className="py-2" />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-12 p-8 bg-primary/5 rounded-[24px] border border-primary/10 text-center golden-glow-premium">
                <h3 className="font-headline text-[22px] mb-4">Elite Vendors</h3>
                <p className="text-[14px] text-muted-foreground mb-8 italic">Join South Africa&apos;s most premium wedding network.</p>
                <Button asChild className="w-full button-rose h-12 text-[13px] shadow-lg golden-glow-premium">
                  <Link href="/apply">REGISTER NOW</Link>
                </Button>
              </div>
            </div>
          </aside>

          {/* Grid Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <h2 className="font-headline text-[36px] md:text-[54px] tracking-tight">Premium Selections</h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-primary/30 rounded-full"></div>
              </div>
              <p className="text-[15px] text-muted-foreground italic font-medium opacity-80">Showing 142 luxury vendors across SA</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
              {FEATURED_VENDORS.map((vendor) => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>

            <div className="mt-20 text-center">
              <Button variant="outline" className="rounded-full px-12 h-14 border-primary/20 text-primary hover:bg-primary/5 uppercase font-bold tracking-[0.2em] text-[13px] shadow-sm golden-glow-premium">
                LOAD MORE VENDORS
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Responsive Trust Section */}
      <section className="bg-white/50 section-padding px-6 border-y border-primary/10 relative overflow-hidden">
        <div className="floral-texture absolute inset-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="font-headline text-[42px] md:text-[52px] mb-4">The Golden Standard</h2>
          <p className="text-[13px] text-primary/70 tracking-[0.3em] uppercase font-bold mb-16">Excellence in every detail</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
            {[
              { title: "Curated Selection", desc: "Only the most reliable and premium vendors in South Africa after a rigorous review process." },
              { title: "Direct Inquiries", desc: "Connect directly with owners without any commission fees or middle-man interference." },
              { title: "Secure Planning", desc: "A safe, high-end environment designed exclusively for luxury wedding journeys." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center group glow-on-scroll visible">
                <div className="w-20 h-20 border border-primary/20 rounded-full flex items-center justify-center mb-8 bg-white shadow-lg golden-glow-premium group-hover:scale-110 transition-transform">
                  <span className="text-primary font-headline text-[32px]">{i + 1}</span>
                </div>
                <h3 className="font-headline text-[24px] md:text-[28px] mb-5 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[16px] font-medium opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
