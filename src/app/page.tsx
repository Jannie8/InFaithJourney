"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Home as HomeIcon, Camera, Palette, Flower2, Utensils, Plane, 
  Music, CalendarCheck, Shirt, PenTool, Cake, Gem, Search, Sparkles
} from 'lucide-react';

export const CORE_VENDORS = [
  { name: 'Venues', icon: HomeIcon, href: '/category/venues', imageId: 'cat-venues' },
  { name: 'Photography', icon: Camera, href: '/category/photography-videography', imageId: 'cat-photo' },
  { name: 'Beauty', icon: Palette, href: '/category/beauty', imageId: 'cat-beauty' },
  { name: 'Flowers', icon: Flower2, href: '/category/flowers-decor', imageId: 'cat-flowers' },
  { name: 'Catering', icon: Utensils, href: '/category/catering', imageId: 'cat-catering' },
  { name: 'Travel', icon: Plane, href: '/category/honeymoon-destinations', imageId: 'cat-honeymoon' },
  { name: 'Music', icon: Music, href: '/category/music-entertainment', imageId: 'cat-music' },
  { name: 'Planning', icon: CalendarCheck, href: '/category/planning-coordination', imageId: 'cat-planning' },
  { name: 'Fashion', icon: Shirt, href: '/category/fashion', imageId: 'cat-fashion' },
  { name: 'Stationery', icon: PenTool, href: '/category/stationery', imageId: 'cat-stationery' },
  { name: 'Cakes', icon: Cake, href: '/category/wedding-cakes', imageId: 'cat-cakes' },
  { name: 'Jewelry', icon: Gem, href: '/category/jewelry', imageId: 'cat-jewelry' },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      {/* Hero Section - Now starts BELOW nav */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center px-4" aria-labelledby="hero-title">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Luxury wedding estate at sunset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-up">
          <h1 id="hero-title" className="text-[42px] md:text-[68px] font-headline text-white mb-6 drop-shadow-lg leading-tight">
            Find Your Perfect Wedding Partner
          </h1>
          <p className="text-[16px] md:text-[20px] text-white/95 mb-10 font-medium italic tracking-wide max-w-2xl mx-auto drop-shadow-md">
            Hand-picked excellence for your magical South African wedding journey.
          </p>
          
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto border border-primary/20">
            <div className="flex-1 w-full px-4 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12 text-[15px] font-medium">
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
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12 text-[15px] font-medium">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cape-town">Cape Town</SelectItem>
                  <SelectItem value="stellenbosch">Stellenbosch</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto h-12 button-rose px-8 text-[14px]">
              <Search className="w-4 h-4 mr-2" /> FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Categories - Now smaller circular tiles */}
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-20 w-full">
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-headline text-[36px] md:text-[42px] mb-3">Browse by Category</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" aria-hidden="true" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
            {CORE_VENDORS.map((v) => {
              const categoryImg = PlaceHolderImages.find(img => img.id === v.imageId);
              return (
                <Link 
                  key={v.name} 
                  href={v.href} 
                  className="group flex flex-col items-center gap-4 transition-all"
                  aria-label={`Explore ${v.name}`}
                >
                  <div className="category-circle">
                    <Image
                      src={categoryImg?.imageUrl || `https://picsum.photos/seed/cat-${v.name}/300/300`}
                      alt=""
                      fill
                      className="object-cover"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-foreground/80 group-hover:text-primary transition-colors text-center">
                    {v.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Value Props */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center bg-white/50 rounded-[40px] p-12 md:p-16 border border-primary/5">
          {[
            { title: "Hand-Picked Excellence", desc: "Only the finest, most reliable wedding experts pass our rigorous screening process.", icon: Sparkles },
            { title: "Direct Access", desc: "Inquire directly with vendor owners without hidden commissions or middlemen.", icon: Utensils },
            { title: "Stress-Free Planning", desc: "A secure, premium environment curated specifically for high-end wedding journeys.", icon: CalendarCheck }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto text-primary border border-primary/10">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-[24px]">{item.title}</h3>
              <p className="text-[15px] text-muted-foreground font-medium italic leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
