
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
  Music, CalendarCheck, Shirt, PenTool, Cake, Gem, Search
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
    <div className="flex flex-col min-h-screen">
      <Navbar transparent={true} />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center px-4">
        <Image
          src={heroImage?.imageUrl || 'https://ik.imagekit.io/625s6afzw/hero2.jpeg?updatedAt=1777038149964'}
          alt="Magical global journey"
          fill
          className="object-cover brightness-[0.85] sepia-[0.1]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/45"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-up px-6">
          <p className="font-script text-[32px] md:text-[36px] text-[#C9A96E] mb-2 drop-shadow-md">A magical global journey</p>
          <h1 className="text-[48px] md:text-[68px] font-headline text-white mb-6 leading-[1.1] font-bold drop-shadow-2xl not-italic">
            Find Your Perfect Global Wedding Vendor
          </h1>
          <p className="text-[17px] md:text-[19px] text-white mb-14 font-medium max-w-3xl mx-auto leading-relaxed italic opacity-95 text-center drop-shadow-md">
            Browse curated & trusted wedding professionals dedicated to bringing your international dream day to life.
          </p>
          
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-[50px] shadow-2xl flex flex-col md:flex-row items-center gap-1 max-w-4xl mx-auto border border-white/20">
            <div className="flex-1 w-full px-8 py-2 text-left">
              <label className="block text-[11px] font-normal text-[#9B7B5B] uppercase tracking-[0.15em] mb-1">I'M LOOKING FOR</label>
              <Select>
                <SelectTrigger className="border-none p-0 focus:ring-0 shadow-none bg-transparent h-auto text-[15px] font-headline font-bold text-[#2C1A0E] not-italic">
                  <SelectValue placeholder="SELECT CATEGORY" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={10} className="z-[200]">
                  {CORE_VENDORS.map(v => (
                    <SelectItem key={v.name} value={v.name.toLowerCase()}>{v.name.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-border/40 mx-2"></div>
            
            <div className="flex-1 w-full px-8 py-2 text-left">
              <label className="block text-[11px] font-normal text-[#9B7B5B] uppercase tracking-[0.15em] mb-1">IN DESTINATION</label>
              <Select>
                <SelectTrigger className="border-none p-0 focus:ring-0 shadow-none bg-transparent h-auto text-[15px] font-headline font-bold text-[#2C1A0E] not-italic">
                  <SelectValue placeholder="ALL LOCATIONS" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={10} className="z-[200]">
                  <SelectItem value="cape-town">CAPE TOWN</SelectItem>
                  <SelectItem value="stellenbosch">STELLENBOSCH</SelectItem>
                  <SelectItem value="johannesburg">JOHANNESBURG</SelectItem>
                  <SelectItem value="london">LONDON, UK</SelectItem>
                  <SelectItem value="paris">PARIS, FRANCE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full md:w-auto h-14 button-rose px-12 text-[12px] font-bold tracking-[0.2em] shadow-lg rounded-[50px]">
              <Search className="w-4 h-4 mr-2" /> FIND VENDORS
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 animate-fade-up">
            <span className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-[0.2em]">Popular Journeys:</span>
            <div className="flex gap-4">
              {['"Venues in Cape Town"', '"Photographers in Paris"', '"London Florists"'].map((suggestion) => (
                <Link 
                  key={suggestion} 
                  href="/vendors" 
                  className="text-[12px] text-white/80 hover:text-white transition-colors italic hover:underline underline-offset-4"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <section className="mb-32">
          <div className="text-center mb-20">
            <h2 className="font-headline text-[42px] md:text-[54px] mb-4 italic text-[#2C1A0E]">Browse by Category</h2>
            <div className="w-24 h-1 bg-[#C4956A] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16">
            {CORE_VENDORS.map((v) => {
              const categoryImg = PlaceHolderImages.find(img => img.id === v.imageId);
              return (
                <Link 
                  key={v.name} 
                  href={v.href} 
                  className="group flex flex-col items-center gap-6 transition-all"
                >
                  <div className="category-circle w-28 h-28 md:w-32 md:h-32 shadow-md">
                    <Image
                      src={categoryImg?.imageUrl || `https://picsum.photos/seed/cat-${v.name}/400/400`}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#9B7B5B] group-hover:text-[#C4956A] transition-colors text-center">
                    {v.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-32">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-16 rounded-[40px] border border-border shadow-soft bg-white/50 backdrop-blur-sm">
              <div className="flex-1 space-y-8">
                <h2 className="font-headline text-[48px] leading-tight italic text-[#2C1A0E]">Hand-Picked Excellence</h2>
                <p className="text-[18px] text-[#5C3D2E] italic font-medium leading-relaxed opacity-90">
                  "Planning should be as beautiful as the wedding day itself. We only work with the most dedicated professionals who share our vision for international elegance."
                </p>
                <div className="flex gap-4">
                   <Button asChild className="button-rose h-14 px-10">
                     <Link href="/vendors">EXPLORE COLLECTIVE</Link>
                   </Button>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <Image src="https://picsum.photos/seed/inf-detail-1/600/600" alt="Wedding detail" fill className="object-cover" />
                </div>
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl mt-12">
                  <Image src="https://picsum.photos/seed/inf-detail-2/600/600" alt="Wedding detail" fill className="object-cover" />
                </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
