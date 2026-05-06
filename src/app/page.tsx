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
      
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center px-4" aria-labelledby="hero-title">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Luxury wedding sunset"
          fill
          className="object-cover brightness-[0.7] sepia-[0.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" aria-hidden="true"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-up px-6">
          <h1 id="hero-title" className="text-[42px] md:text-[72px] font-headline text-white mb-6 drop-shadow-2xl leading-tight">
            Discover Your Perfect Wedding Partner
          </h1>
          <p className="text-[17px] md:text-[22px] text-white/90 mb-10 font-medium italic tracking-wide max-w-2xl mx-auto drop-shadow-lg">
            Curated excellence for South Africa&apos;s most romantic journeys.
          </p>
          
          <div className="bg-card/90 backdrop-blur-md p-3 rounded-[32px] md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto border border-white/5">
            <div className="flex-1 w-full px-4 md:border-r border-white/5">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12 text-[15px] font-medium text-foreground">
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
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12 text-[15px] font-medium text-foreground">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cape-town">Cape Town</SelectItem>
                  <SelectItem value="stellenbosch">Stellenbosch</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto h-12 button-rose px-8 text-[14px] font-bold tracking-widest">
              <Search className="w-4 h-4 mr-2" /> FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-headline text-[36px] md:text-[48px] mb-3 text-foreground">Browse by Category</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" aria-hidden="true" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-12">
            {CORE_VENDORS.map((v) => {
              const categoryImg = PlaceHolderImages.find(img => img.id === v.imageId);
              return (
                <Link 
                  key={v.name} 
                  href={v.href} 
                  className="group flex flex-col items-center gap-5 transition-all"
                  aria-label={`Explore ${v.name}`}
                >
                  <div className="category-circle border-white/10 group-hover:border-secondary shadow-2xl">
                    <Image
                      src={categoryImg?.imageUrl || `https://picsum.photos/seed/cat-${v.name}/300/300`}
                      alt=""
                      fill
                      className="object-cover brightness-[0.8] group-hover:brightness-100 transition-all"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-secondary transition-colors text-center">
                    {v.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center bg-card/40 rounded-[48px] p-12 md:p-20 border border-white/5">
          {[
            { title: "Hand-Picked Excellence", desc: "Only the finest wedding experts pass our rigorous screening process.", icon: Sparkles },
            { title: "Direct Connections", desc: "Inquire directly with owners without hidden commissions or middlemen.", icon: Utensils },
            { title: "Romantic Curation", desc: "A secure environment curated specifically for high-end wedding visions.", icon: CalendarCheck }
          ].map((item, i) => (
            <div key={i} className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-secondary border border-white/5 shadow-inner">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-[26px] text-foreground">{item.title}</h3>
              <p className="text-[15.5px] text-muted-foreground font-medium italic leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
