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
  Music, CalendarCheck, Shirt, PenTool, Cake, Gem, Search, SlidersHorizontal, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export const CORE_VENDORS = [
  { name: 'Venues', icon: HomeIcon, href: '/category/venues', imageId: 'cat-venues' },
  { name: 'Photography & Videography', icon: Camera, href: '/category/photography-videography', imageId: 'cat-photo' },
  { name: 'Beauty', icon: Palette, href: '/category/beauty', imageId: 'cat-beauty' },
  { name: 'Flowers & Decor', icon: Flower2, href: '/category/flowers-decor', imageId: 'cat-flowers' },
  { name: 'Catering', icon: Utensils, href: '/category/catering', imageId: 'cat-catering' },
  { name: 'Honeymoon Destinations', icon: Plane, href: '/category/honeymoon-destinations', imageId: 'cat-honeymoon' },
  { name: 'Music & Entertainment', icon: Music, href: '/category/music-entertainment', imageId: 'cat-music' },
  { name: 'Planning & Coordination', icon: CalendarCheck, href: '/category/planning-coordination', imageId: 'cat-planning' },
  { name: 'Fashion', icon: Shirt, href: '/category/fashion', imageId: 'cat-fashion' },
  { name: 'Stationery', icon: PenTool, href: '/category/stationery', imageId: 'cat-stationery' },
  { name: 'Wedding Cakes', icon: Cake, href: '/category/wedding-cakes', imageId: 'cat-cakes' },
  { name: 'Jewelry', icon: Gem, href: '/category/jewelry', imageId: 'cat-jewelry' },
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
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center px-4" aria-labelledby="hero-title">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Luxury wedding estate at sunset"
          fill
          className="object-cover brightness-[0.6]"
          priority
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-up">
          <h1 id="hero-title" className="text-[48px] md:text-[86px] font-headline text-white mb-6 drop-shadow-lg leading-tight">
            Discover Your Perfect Wedding Partner
          </h1>
          <p className="text-[18px] md:text-[24px] text-white/95 mb-14 font-medium italic tracking-wide max-w-3xl mx-auto drop-shadow-md">
            Hand-picked excellence for your magical South African wedding.
          </p>
          
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto border border-primary/20">
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-14 text-[17px] font-medium" aria-label="Select Category">
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
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-14 text-[17px] font-medium" aria-label="Select Location">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cape-town">Cape Town</SelectItem>
                  <SelectItem value="stellenbosch">Stellenbosch</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" className="w-full md:w-auto h-14 button-rose px-12 text-[16px]">
              <Search className="w-5 h-5 mr-2" /> FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-6 pt-24 pb-32 w-full">
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="font-headline text-[48px] mb-4">Browse by Category</h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full" aria-hidden="true" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {CORE_VENDORS.map((v) => {
              const categoryImg = PlaceHolderImages.find(img => img.id === v.imageId);
              return (
                <Link 
                  key={v.name} 
                  href={v.href} 
                  className="group relative h-[450px] rounded-[32px] overflow-hidden shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
                  aria-label={`Explore ${v.name}`}
                >
                  <Image
                    src={categoryImg?.imageUrl || `https://picsum.photos/seed/cat-${v.name}/800/1200`}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-10 left-0 w-full text-center px-6">
                    <h3 className="font-headline text-[32px] text-white tracking-tight leading-tight">{v.name}</h3>
                    <div className="w-0 h-[2px] bg-secondary mx-auto mt-4 transition-all duration-500 group-hover:w-16" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Value Props */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center bg-white rounded-[60px] p-20 shadow-soft border border-primary/5">
          {[
            { title: "Hand-Picked Excellence", desc: "Only the finest, most reliable wedding experts pass our rigorous screening process.", icon: Sparkles },
            { title: "Direct Access", desc: "Inquire directly with vendor owners without hidden commissions or middlemen.", icon: Utensils },
            { title: "Stress-Free Planning", desc: "A secure, premium environment curated specifically for high-end wedding journeys.", icon: CalendarCheck }
          ].map((item, i) => (
            <div key={i} className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto text-primary border border-primary/10">
                <item.icon className="w-10 h-10" />
              </div>
              <h3 className="font-headline text-[28px]">{item.title}</h3>
              <p className="text-muted-foreground font-medium italic leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
