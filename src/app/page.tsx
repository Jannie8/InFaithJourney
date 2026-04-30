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
  Music, CalendarCheck, Shirt, PenTool, Cake, Gem 
} from 'lucide-react';

const CORE_VENDORS = [
  { name: 'Venues', icon: HomeIcon, href: '/vendors?category=venues' },
  { name: 'Photography & Videography', icon: Camera, href: '/vendors?category=photo' },
  { name: 'Beauty', icon: Palette, href: '/vendors?category=beauty' },
  { name: 'Flowers & Decor', icon: Flower2, href: '/vendors?category=floral' },
  { name: 'Catering', icon: Utensils, href: '/vendors?category=catering' },
  { name: 'Honeymoon Destinations', icon: Plane, href: '/vendors?category=honeymoon' },
  { name: 'Music & Entertainment', icon: Music, href: '/vendors?category=music' },
  { name: 'Planning & Coordination', icon: CalendarCheck, href: '/vendors?category=planning' },
  { name: 'Fashion', icon: Shirt, href: '/vendors?category=fashion' },
  { name: 'Stationery', icon: PenTool, href: '/vendors?category=stationery' },
  { name: 'Wedding Cakes', icon: Cake, href: '/vendors?category=cakes' },
  { name: 'Jewelry', icon: Gem, href: '/vendors?category=jewelry' },
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

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center hero-padding">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Golden hour wedding"
          fill
          className="object-cover brightness-[0.55] sepia-overlay"
          priority
          data-ai-hint="wedding sunset lights"
        />
        <div className="absolute inset-0 bg-black/45"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <h1 className="text-[58px] md:text-[76px] font-headline text-white mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] leading-tight animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Find Your Perfect Wedding Vendor
          </h1>
          <p className="text-[19px] md:text-[24px] text-white/95 mb-14 font-medium italic tracking-wide max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            Experience the magic of golden hour South African weddings with our curated network.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-2xl p-4 rounded-[32px] shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto border border-primary/25 animate-in fade-in zoom-in duration-1000 delay-500 golden-glow-premium">
            <div className="flex-1 w-full px-8 border-b md:border-b-0 md:border-r border-primary/15">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-16 text-[17px] font-medium text-foreground/85">
                  <SelectValue placeholder="I'm Looking For..." />
                </SelectTrigger>
                <SelectContent>
                  {CORE_VENDORS.map(v => (
                    <SelectItem key={v.name} value={v.name.toLowerCase()}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full px-8 border-b md:border-b-0 md:border-r border-primary/15">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-16 text-[17px] font-medium text-foreground/85">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cape-town">Cape Town</SelectItem>
                  <SelectItem value="stellenbosch">Stellenbosch</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                  <SelectItem value="pretoria">Pretoria</SelectItem>
                  <SelectItem value="garden-route">Garden Route</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" className="w-full md:w-auto h-16 button-rose px-14 text-[16px] golden-glow-premium">
              FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Tabs */}
      <section className="max-w-7xl mx-auto px-6 section-padding w-full">
        <div className="text-center mb-20 animate-fade-up">
          <h2 className="font-headline text-[46px] mb-6">Browse by Category</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-secondary/60 mx-auto rounded-full mb-10 shadow-[0_0_15px_rgba(212,175,55,0.7)]"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {CORE_VENDORS.map((v) => (
            <Link key={v.name} href={v.href} className="icon-tab group golden-glow-premium">
              <v.icon className="w-12 h-12 text-primary group-hover:text-secondary transition-all duration-500 group-hover:scale-110" />
              <span className="text-[13.5px] font-bold uppercase tracking-widest text-center opacity-85">{v.name}</span>
              <div className="mt-2 w-0 h-[2px] bg-secondary group-hover:w-full transition-all duration-500 shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pb-[120px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[48px]">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 lg:w-[300px] space-y-12">
            <div className="bg-white/55 backdrop-blur-md p-10 rounded-[32px] border border-primary/15 shadow-sm sticky top-32">
              <h3 className="font-headline text-[30px] mb-10 border-b border-primary/15 pb-6">Filter Results</h3>
              <div className="space-y-12">
                <div className="space-y-6">
                  <h4 className="text-[14px] font-bold uppercase tracking-widest text-primary/90">Core Categories</h4>
                  <div className="space-y-5">
                    {CORE_VENDORS.map((v) => (
                      <div key={v.name} className="flex items-center space-x-4 group cursor-pointer">
                        <Checkbox id={v.name} className="rounded-full border-primary/40 w-5 h-5 data-[state=checked]:bg-secondary transition-all" />
                        <label htmlFor={v.name} className="text-[15px] font-medium leading-tight cursor-pointer group-hover:text-secondary transition-colors text-foreground/85">{v.name}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 pt-10 border-t border-primary/15">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-[14px] font-bold uppercase tracking-widest text-primary/90">Price Range</h4>
                    <span className="text-[15px] font-bold text-foreground/65">R10k – R50k+</span>
                  </div>
                  <Slider defaultValue={[25000]} max={100000} step={1000} className="py-2" />
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[32px] border border-primary/15 text-center shadow-md golden-glow-premium group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
              <h3 className="font-headline text-[24px] mb-6">Apply as a Vendor</h3>
              <p className="text-[16px] text-muted-foreground mb-10 leading-relaxed font-medium opacity-90 italic">Join South Africa's most elite wedding vendor network.</p>
              <Button asChild className="w-full button-rose h-14 text-[15px] shadow-lg golden-glow-premium">
                <Link href="/apply">REGISTER NOW</Link>
              </Button>
            </div>
          </aside>

          {/* Vendor Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="space-y-3">
                <h2 className="font-headline text-[48px] md:text-[54px] tracking-tight">Premium Vendors</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-primary/40 rounded-full"></div>
              </div>
              <p className="text-[16.5px] text-muted-foreground italic font-medium opacity-90">Showing 142 luxury vendors in South Africa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[40px]">
              {FEATURED_VENDORS.map((vendor) => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>

            <div className="mt-24 text-center">
              <Button variant="outline" className="rounded-[20px] px-20 h-16 border-primary/35 text-primary hover:bg-primary/5 uppercase font-bold tracking-[0.2em] text-[14px] shadow-sm golden-glow-premium">
                LOAD MORE VENDORS
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="bg-white/65 section-padding px-6 border-y border-primary/15 relative overflow-hidden">
        <div className="floral-texture absolute inset-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 animate-fade-up">
            <h2 className="font-headline text-[52px] mb-5">The Golden Standard</h2>
            <p className="text-[16px] text-primary/80 tracking-[0.3em] uppercase font-bold">Excellence in every detail</p>
            <div className="mt-8 w-32 h-[1px] bg-secondary/50 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { title: "Curated Selection", desc: "We only list the most reliable and premium vendors in South Africa after a strict review process." },
              { title: "Direct Inquiries", desc: "Connect directly with business owners without any commission fees or middle-man interference." },
              { title: "Secure Planning", desc: "Our platform ensures a safe, high-end environment for your luxury wedding planning journey." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group glow-on-scroll visible">
                <div className="w-24 h-24 border border-primary/25 rounded-full flex items-center justify-center mb-10 bg-white shadow-lg golden-glow-premium group-hover:scale-110 transition-transform">
                  <span className="text-primary font-headline text-[38px] drop-shadow-sm">{i + 1}</span>
                </div>
                <h3 className="font-headline text-[28px] mb-6 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[17px] font-medium opacity-95">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
