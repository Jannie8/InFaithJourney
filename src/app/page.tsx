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
    imageHint: 'luxury venue garden'
  },
  {
    id: 'nearby-bridal',
    name: 'Nearby Bridal',
    location: 'Cape Town, WC',
    rating: 4.8,
    reviews: 18,
    category: 'Bridal Shop',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-bridal')?.imageUrl || '',
    imageHint: 'bridal shop lace'
  },
  {
    id: 'evergold-photography',
    name: 'Evergold Photography',
    location: 'Johannesburg, GP',
    rating: 4.9,
    reviews: 42,
    category: 'Photography',
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '',
    imageHint: 'wedding photo warm'
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Romantic wedding couple"
          fill
          className="object-cover brightness-[0.8] sepia-overlay"
          priority
          data-ai-hint="wedding couple cherry blossom"
        />
        <div className="absolute inset-0 hero-gradient"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <h1 className="text-6xl md:text-8xl font-headline text-white mb-8 drop-shadow-2xl leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Find Your Perfect Wedding Vendor
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-16 font-light italic tracking-[0.15em] max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Browse curated & trusted vendors for South Africa's most elite wedding experiences.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-xl p-4 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto border border-primary/20 animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="flex-1 w-full px-8 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-16 text-lg font-medium text-foreground/80">
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
            <div className="flex-1 w-full px-8 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-16 text-lg font-medium text-foreground/80">
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
            <Button size="lg" className="w-full md:w-auto h-16 button-rose px-16 text-[14px]">
              FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 section-padding w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-24">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-16 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div>
              <h3 className="font-headline text-4xl mb-10 border-b border-primary/10 pb-6">Filter Results</h3>
              <div className="space-y-12">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Categories</h4>
                  <div className="space-y-5">
                    {['Wedding Venues', 'Photographers', 'Bridal Wear', 'Catering', 'Floral Design', 'Beauty & Hair', 'Music & DJ'].map((cat) => (
                      <div key={cat} className="flex items-center space-x-4 group cursor-pointer">
                        <Checkbox id={cat} className="rounded-full border-primary/40 w-5 h-5" />
                        <label htmlFor={cat} className="text-[15px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors opacity-80 group-hover:opacity-100">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 pt-12 border-t border-primary/10">
                  <div className="flex justify-between items-end">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Price Range</h4>
                    <span className="text-[12px] font-bold opacity-70">R10k – R50k+</span>
                  </div>
                  <Slider defaultValue={[20000]} max={100000} step={1000} className="py-4" />
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-[30px] p-12 border border-primary/10 relative overflow-hidden text-center shadow-xl shadow-primary/5">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
              <h3 className="font-headline text-2xl mb-6">Apply as a Vendor</h3>
              <p className="text-[15px] text-muted-foreground mb-10 leading-relaxed font-medium">Join South Africa's most elite wedding vendor network and grow your business today.</p>
              <Button asChild className="w-full button-rose h-14">
                <Link href="/apply">REGISTER NOW</Link>
              </Button>
            </div>
          </aside>

          {/* Vendor Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="space-y-4">
                <h2 className="font-headline text-5xl md:text-6xl">Premium Vendors</h2>
                <div className="w-24 h-1.5 bg-primary rounded-full"></div>
              </div>
              <p className="text-[15px] text-muted-foreground italic font-medium tracking-wide border-b border-primary/10 pb-2">Showing 142 luxury vendors in South Africa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
              {FEATURED_VENDORS.map((vendor) => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>

            <div className="mt-28 text-center">
              <Button variant="outline" className="rounded-full px-20 h-16 border-primary/30 text-primary hover:bg-primary/5 uppercase font-bold tracking-[0.3em] text-[12px] shadow-sm">
                LOAD MORE VENDORS
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="bg-white/40 section-padding px-6 border-y border-primary/10 relative overflow-hidden">
        <div className="floral-texture absolute inset-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-28">
            <h2 className="font-headline text-6xl mb-8">Why InFaith Journey?</h2>
            <p className="text-xl text-muted-foreground italic tracking-[0.2em] uppercase font-bold opacity-60">The standard of excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[
              { title: "Curated Selection", desc: "We only list the most reliable and premium vendors in South Africa after a strict review process." },
              { title: "Direct Inquiries", desc: "Connect directly with business owners without any commission fees or middle-man interference." },
              { title: "Secure Planning", desc: "Our platform ensures a safe, high-end environment for your luxury wedding planning journey." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 border border-primary/20 rounded-full flex items-center justify-center mb-10 bg-white/50 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10">
                  <span className="text-primary font-headline text-4xl">{i + 1}</span>
                </div>
                <h3 className="font-headline text-3xl mb-8 tracking-wide">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
