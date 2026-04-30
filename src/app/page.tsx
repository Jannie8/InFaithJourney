
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const FEATURED_VENDORS = [
  {
    id: 'sunstone-manor',
    name: 'Sunstone Manor',
    location: 'Stellenbosch, WC',
    rating: 5.0,
    reviews: 24,
    category: 'Wedding Venue',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '',
    imageHint: 'luxury venue',
    priceRange: 'R45,000'
  },
  {
    id: 'nearby-bridal',
    name: 'Nearby Bridal',
    location: 'Cape Town, WC',
    rating: 4.8,
    reviews: 18,
    category: 'Bridal Shop',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '',
    imageHint: 'bridal shop'
  },
  {
    id: 'evergold-photography',
    name: 'Evergold Photography',
    location: 'Johannesburg, GP',
    rating: 4.9,
    reviews: 42,
    category: 'Photography',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-photo')?.imageUrl || '',
    imageHint: 'wedding photo'
  },
  {
    id: 'rosa-melia',
    name: 'Rosa Melia',
    location: 'Cape Town, WC',
    rating: 5.0,
    reviews: 15,
    category: 'Floral Design',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-floral')?.imageUrl || '',
    imageHint: 'floral arrangement'
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Luxury wedding arch"
          fill
          className="object-cover brightness-[0.8] sepia-overlay"
          priority
          data-ai-hint="wedding couple"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background/20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-7xl font-headline text-white mb-6 drop-shadow-lg">
            Find Your Perfect Wedding Vendor
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-light italic tracking-wide">
            Discover the most romantic and elite wedding services across South Africa
          </p>
          
          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto border border-primary/20">
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12">
                  <SelectValue placeholder="I'm Looking For..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venues">Wedding Venues</SelectItem>
                  <SelectItem value="photography">Photographers</SelectItem>
                  <SelectItem value="bridal">Bridal Shops</SelectItem>
                  <SelectItem value="flowers">Floral Designers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-12">
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
            <Button size="lg" className="w-full md:w-auto rounded-full px-10 h-12 bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase">
              FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area with Sidebar */}
      <main className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="font-headline text-2xl mb-6">Filter Results</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Categories</h4>
                  <div className="space-y-3">
                    {['Wedding Venues', 'Photographers', 'Bridal Wear', 'Catering', 'Flowers', 'Music'].map((cat) => (
                      <div key={cat} className="flex items-center space-x-3">
                        <Checkbox id={cat} className="rounded-full border-primary/50" />
                        <label htmlFor={cat} className="text-sm font-medium leading-none cursor-pointer">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-primary/10">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Price Range</h4>
                    <span className="text-xs font-medium">R10,000 – R50,000+</span>
                  </div>
                  <Slider defaultValue={[20000]} max={100000} step={1000} className="py-4" />
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h3 className="font-headline text-xl mb-4">Apply as a Vendor</h3>
              <p className="text-sm text-muted-foreground mb-6">Join South Africa's most elite wedding vendor network and grow your business today.</p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                <Link href="/apply">REGISTER NOW</Link>
              </Button>
            </div>
          </aside>

          {/* Vendor Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-headline text-3xl">Premium Vendors</h2>
              <p className="text-sm text-muted-foreground italic tracking-wide">Showing 142 luxury vendors in Cape Town</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {FEATURED_VENDORS.map((vendor) => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button variant="outline" className="rounded-full px-12 py-6 border-primary text-primary hover:bg-primary/5">
                LOAD MORE VENDORS
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Why InFaith Journey Section */}
      <section className="bg-white py-24 px-6 border-y border-primary/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-headline text-4xl mb-4">Why InFaith Journey?</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-16 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Curated Selection", desc: "We only list the most reliable and premium vendors in South Africa." },
              { title: "Direct Inquiries", desc: "Connect directly with vendors without middle-man interference." },
              { title: "Secure Booking", desc: "Our platform ensures your wedding planning journey is safe and secure." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-primary font-bold text-2xl">{i + 1}</span>
                </div>
                <h3 className="font-headline text-2xl mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
import Link from 'next/link';
