
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ALL_VENDORS = [
  { id: '1', name: 'Evergold Photography', location: 'Johannesburg', rating: 4.9, reviews: 120, category: 'Photography', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-photo')?.imageUrl || '', imageHint: 'photo' },
  { id: '2', name: 'Misty Vineyards', location: 'Stellenbosch', rating: 5.0, reviews: 85, category: 'Wedding Venue', imageUrl: PlaceHolderImages.find(img => img.id === 'venue-vineyard')?.imageUrl || '', imageHint: 'vineyard', priceRange: 'R80,000' },
  { id: '3', name: 'Nearby Bridal', location: 'Cape Town', rating: 4.7, reviews: 45, category: 'Bridal Wear', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '', imageHint: 'bridal' },
  { id: '4', name: 'Rosa Melia', location: 'Cape Town', rating: 5.0, reviews: 32, category: 'Floral Design', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-floral')?.imageUrl || '', imageHint: 'flowers' },
  { id: '5', name: 'Sunstone Manor', location: 'Stellenbosch', rating: 5.0, reviews: 210, category: 'Wedding Venue', imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '', imageHint: 'venue', priceRange: 'R120,000' },
  { id: '6', name: 'Everhaven Cakes', location: 'Pretoria', rating: 4.8, reviews: 19, category: 'Cakes', imageUrl: PlaceHolderImages.find(img => img.id === 'gallery-6')?.imageUrl || '', imageHint: 'cake' },
];

export default function VendorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20 w-full flex-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-headline">Browse Our Premium Vendors</h1>
          <div className="relative w-full md:w-96">
            <Input className="rounded-full pl-12 h-12 border-primary/20 bg-white" placeholder="Search by name..." />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="font-headline text-2xl mb-6">Refine Search</h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Category</h4>
                  {['Wedding Venues', 'Photographers', 'Bridal Shops', 'Floral Designers', 'Cake Artists', 'Beauty & Makeup'].map(cat => (
                    <div key={cat} className="flex items-center space-x-3">
                      <Checkbox id={cat} className="rounded-full border-primary/40" />
                      <label htmlFor={cat} className="text-sm font-medium leading-none cursor-pointer">{cat}</label>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-primary/10">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Service Location</h4>
                  {['Cape Town', 'Stellenbosch', 'Johannesburg', 'Pretoria', 'Garden Route'].map(loc => (
                    <div key={loc} className="flex items-center space-x-3">
                      <Checkbox id={loc} className="rounded-full border-primary/40" />
                      <label htmlFor={loc} className="text-sm font-medium leading-none cursor-pointer">{loc}</label>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-primary/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Budget</h4>
                    <span className="text-xs text-primary font-bold tracking-tighter">R5,000 – R100k+</span>
                  </div>
                  <Slider defaultValue={[20]} max={100} step={1} className="py-2" />
                </div>
              </div>
            </div>
          </aside>

          {/* Vendors List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
