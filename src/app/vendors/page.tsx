
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Users, Wallet, Sparkles } from 'lucide-react';
import Image from 'next/image';

const CORE_CATEGORIES = [
  'Venues', 'Photography & Videography', 'Beauty', 'Flowers & Decor', 
  'Catering', 'Honeymoon Destinations', 'Music & Entertainment', 
  'Planning & Coordination', 'Fashion', 'Stationery', 'Wedding Cakes', 'Jewelry'
];

const ALL_VENDORS = [
  { id: '1', name: 'Evergold Photography', location: 'Johannesburg', rating: 4.9, reviews: 120, category: 'Photography & Videography', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '', imageHint: 'wedding couple glow' },
  { id: '2', name: 'Misty Vineyards', location: 'Stellenbosch', rating: 5.0, reviews: 85, category: 'Venues', imageUrl: PlaceHolderImages.find(img => img.id === 'hero-venues')?.imageUrl || '', imageHint: 'wedding venue sunset' },
  { id: '3', name: 'Nearby Bridal', location: 'Cape Town', rating: 4.7, reviews: 45, category: 'Fashion', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '', imageHint: 'wedding dress warm' },
  { id: '4', name: 'Rosa Melia', location: 'Cape Town', rating: 5.0, reviews: 32, category: 'Flowers & Decor', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-floral')?.imageUrl || '', imageHint: 'wedding floral arch' },
  { id: '5', name: 'Sunstone Manor', location: 'Stellenbosch', rating: 5.0, reviews: 210, category: 'Venues', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '', imageHint: 'wedding estate lights' },
];

export default function VendorsPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-venues');

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      {/* Search Hero */}
      <section className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Golden hour wedding venue"
          fill
          className="object-cover sepia-overlay brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-[48px] md:text-[60px] font-headline text-white mb-8 drop-shadow-2xl">Find Your Elite Vendor</h1>
          <div className="relative w-full max-w-2xl mx-auto group">
            <Input className="rounded-full pl-14 h-14 border-none bg-white text-[16.5px] shadow-2xl focus-visible:ring-secondary/30" placeholder="Search by name, category or style..." />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[36px]">
          
          {/* Advanced Filters Sidebar */}
          <aside className="lg:col-span-1 lg:w-[280px] space-y-12">
            <div className="bg-white/40 p-8 rounded-3xl border border-primary/10">
              <h3 className="font-headline text-[28px] mb-8 border-b border-primary/10 pb-4">Refine Results</h3>
              <div className="space-y-10">
                
                {/* Categories */}
                <div className="space-y-6">
                   <h4 className="text-[13.5px] font-bold uppercase tracking-widest text-primary">Core Categories</h4>
                   <div className="space-y-3">
                    {CORE_CATEGORIES.map(cat => (
                      <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={`cat-${cat}`} className="rounded-full border-primary/40 w-4 h-4 data-[state=checked]:bg-secondary" />
                        <label htmlFor={`cat-${cat}`} className="text-[14px] font-medium leading-tight cursor-pointer group-hover:text-secondary transition-colors text-foreground/80">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-6 pt-10 border-t border-primary/10">
                  <div className="flex items-center gap-3 text-primary">
                    <MapPin className="w-4.5 h-4.5" />
                    <h4 className="text-[13.5px] font-bold uppercase tracking-widest">Service Location</h4>
                  </div>
                  <div className="space-y-4">
                    {['Cape Town', 'Stellenbosch', 'Johannesburg', 'Pretoria', 'Garden Route'].map(loc => (
                      <div key={loc} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={`loc-${loc}`} className="rounded-full border-primary/40 w-4.5 h-4.5" />
                        <label htmlFor={`loc-${loc}`} className="text-[15px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/80">{loc}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-6 pt-10 border-t border-primary/10">
                  <div className="flex items-center gap-3 text-primary">
                    <Wallet className="w-4.5 h-4.5" />
                    <h4 className="text-[13.5px] font-bold uppercase tracking-widest">Budget Range</h4>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-[13.5px] font-bold text-foreground/60">
                      <span>R5,000</span>
                      <span>R100k+</span>
                    </div>
                    <Slider defaultValue={[40]} max={100} step={1} className="py-2" />
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* Vendors grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-headline text-[36px]">Elite Selections</h2>
              <p className="text-[15.5px] text-muted-foreground italic font-medium">85 premium vendors found</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[36px]">
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
