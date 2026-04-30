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

const FEATURED_VENDORS = [
  {
    id: 'sunstone-manor',
    name: 'Sunstone Manor',
    location: 'Stellenbosch, WC',
    rating: 5.0,
    reviews: 24,
    category: 'Wedding Venue',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-sunstone')?.imageUrl || '',
    imageHint: 'luxury venue'
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
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '',
    imageHint: 'wedding photo'
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Luxury wedding couple"
          fill
          className="object-cover brightness-[0.75] sepia-overlay"
          priority
          data-ai-hint="wedding couple"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background/40"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <h1 className="text-6xl md:text-8xl font-headline text-white mb-8 drop-shadow-2xl leading-[1.1]">
            Find Your Perfect Wedding Vendor
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-14 font-light italic tracking-[0.1em] max-w-3xl mx-auto">
            Browse curated & trusted vendors for South Africa's most elite wedding experiences.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-3 max-w-4xl mx-auto border border-primary/20">
            <div className="flex-1 w-full px-6 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-14 text-lg font-medium">
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
            <div className="flex-1 w-full px-6 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-14 text-lg font-medium">
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
            <Button size="lg" className="w-full md:w-auto rounded-full px-12 h-14 button-rose font-bold tracking-[0.2em] uppercase text-[13px]">
              FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="font-headline text-3xl mb-8 border-b border-primary/10 pb-4">Filter Results</h3>
              <div className="space-y-10">
                <div className="space-y-5">
                  <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary">Categories</h4>
                  <div className="space-y-4">
                    {['Wedding Venues', 'Photographers', 'Bridal Wear', 'Catering', 'Flowers', 'Music'].map((cat) => (
                      <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={cat} className="rounded-full border-primary/50" />
                        <label htmlFor={cat} className="text-[14px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-primary/10">
                  <div className="flex justify-between items-end">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary">Price Range</h4>
                    <span className="text-[12px] font-bold opacity-60">R10,000 – R50,000+</span>
                  </div>
                  <Slider defaultValue={[20000]} max={100000} step={1000} className="py-4" />
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-3xl p-10 border border-primary/10 relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <h3 className="font-headline text-2xl mb-4">Apply as a Vendor</h3>
              <p className="text-[14px] text-muted-foreground mb-8 leading-relaxed">Join South Africa's most elite wedding vendor network and grow your business today.</p>
              <Button asChild className="w-full button-rose rounded-full py-6 uppercase tracking-[0.2em] text-[11px] font-bold">
                <Link href="/apply">REGISTER NOW</Link>
              </Button>
            </div>
          </aside>

          {/* Vendor Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="font-headline text-5xl mb-4">Premium Vendors</h2>
                <div className="w-20 h-1.5 bg-primary rounded-full"></div>
              </div>
              <p className="text-[14px] text-muted-foreground italic font-medium tracking-wide">Showing 142 luxury vendors in South Africa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
              {FEATURED_VENDORS.map((vendor) => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>

            <div className="mt-24 text-center">
              <Button variant="outline" className="rounded-full px-16 py-8 border-primary/30 text-primary hover:bg-primary/5 uppercase font-bold tracking-[0.2em] text-[12px]">
                LOAD MORE VENDORS
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="bg-white/40 py-32 px-6 border-y border-primary/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-headline text-5xl mb-6">Why InFaith Journey?</h2>
            <p className="text-lg text-muted-foreground italic tracking-widest uppercase">The standard of excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { title: "Curated Selection", desc: "We only list the most reliable and premium vendors in South Africa after a strict review." },
              { title: "Direct Inquiries", desc: "Connect directly with business owners without any commission or middle-man fees." },
              { title: "Secure Planning", desc: "Our platform ensures a safe environment for your wedding planning journey." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 border border-primary/20 rounded-full flex items-center justify-center mb-8 bg-white/50 shadow-sm">
                  <span className="text-primary font-headline text-3xl">{i + 1}</span>
                </div>
                <h3 className="font-headline text-2xl mb-6 uppercase tracking-wider">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
