import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Users, Wallet, Sparkles } from 'lucide-react';
import Image from 'next/image';

const ALL_VENDORS = [
  { id: '1', name: 'Evergold Photography', location: 'Johannesburg', rating: 4.9, reviews: 120, category: 'Photography', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '', imageHint: 'photo' },
  { id: '2', name: 'Misty Vineyards', location: 'Stellenbosch', rating: 5.0, reviews: 85, category: 'Wedding Venue', imageUrl: PlaceHolderImages.find(img => img.id === 'hero-venues')?.imageUrl || '', imageHint: 'vineyard' },
  { id: '3', name: 'Nearby Bridal', location: 'Cape Town', rating: 4.7, reviews: 45, category: 'Bridal Wear', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '', imageHint: 'bridal' },
  { id: '4', name: 'Rosa Melia', location: 'Cape Town', rating: 5.0, reviews: 32, category: 'Floral Design', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-floral')?.imageUrl || '', imageHint: 'flowers' },
  { id: '5', name: 'Sunstone Manor', location: 'Stellenbosch', rating: 5.0, reviews: 210, category: 'Wedding Venue', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '', imageHint: 'venue' },
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
          alt="Wedding venue"
          fill
          className="object-cover sepia-overlay brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-[48px] md:text-[60px] font-headline text-white mb-8 drop-shadow-xl">Browse Wedding Venues</h1>
          <div className="relative w-full max-w-2xl mx-auto group">
            <Input className="rounded-full pl-14 h-14 border-none bg-white text-[16.5px] shadow-2xl focus-visible:ring-primary/30" placeholder="Search by name or style..." />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[36px]">
          
          {/* Advanced Filters Sidebar */}
          <aside className="lg:col-span-1 lg:w-[280px] space-y-12">
            <div>
              <h3 className="font-headline text-[28px] mb-8 border-b border-primary/10 pb-4">Refine Results</h3>
              <div className="space-y-10">
                
                {/* Location */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <MapPin className="w-4.5 h-4.5" />
                    <h4 className="text-[13.5px] font-bold uppercase tracking-widest">Service Location</h4>
                  </div>
                  <div className="space-y-4">
                    {['Cape Town', 'Stellenbosch', 'Johannesburg', 'Pretoria', 'Garden Route'].map(loc => (
                      <div key={loc} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={`loc-${loc}`} className="rounded-full border-primary/40 w-4.5 h-4.5" />
                        <label htmlFor={`loc-${loc}`} className="text-[16px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/80">{loc}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-6 pt-10 border-t border-primary/10">
                  <div className="flex items-center gap-3 text-primary">
                    <Users className="w-4.5 h-4.5" />
                    <h4 className="text-[13.5px] font-bold uppercase tracking-widest">Guest Capacity</h4>
                  </div>
                  <div className="space-y-4">
                    {['Intimate (0-50)', 'Standard (50-150)', 'Large (150-300)', 'Grand (300+)'].map(cap => (
                      <div key={cap} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={`cap-${cap}`} className="rounded-full border-primary/40 w-4.5 h-4.5" />
                        <label htmlFor={`cap-${cap}`} className="text-[16px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/80">{cap}</label>
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
              <h2 className="font-headline text-[36px]">Featured Venues</h2>
              <p className="text-[15.5px] text-muted-foreground italic font-medium">85 premium venues found</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[36px]">
              {ALL_VENDORS.filter(v => v.category === 'Wedding Venue').map(vendor => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
              {/* Duplicate for demo */}
              {ALL_VENDORS.filter(v => v.category === 'Wedding Venue').map(vendor => (
                <VendorCard key={`${vendor.id}-copy`} {...vendor} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
