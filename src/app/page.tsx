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
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Romantic wedding couple"
          fill
          className="object-cover brightness-[0.8] sepia-overlay"
          priority
          data-ai-hint="wedding couple cherry blossom"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <h1 className="text-[55px] md:text-[72px] font-headline text-white mb-6 drop-shadow-lg leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Find Your Perfect Wedding Vendor
          </h1>
          <p className="text-[18px] md:text-[22px] text-white/95 mb-12 font-medium italic tracking-wide max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Browse curated & trusted vendors for South Africa's most elite wedding experiences.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-xl p-3 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-3 max-w-4xl mx-auto border border-primary/20 animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="flex-1 w-full px-6 border-b md:border-b-0 md:border-r border-primary/10">
              <Select>
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-14 text-[16px] font-medium text-foreground/80">
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
                <SelectTrigger className="border-none focus:ring-0 shadow-none bg-transparent h-14 text-[16px] font-medium text-foreground/80">
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
            <Button size="lg" className="w-full md:w-auto h-14 button-rose px-12 text-[15px]">
              FIND VENDORS
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 section-padding w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[36px]">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 lg:w-[280px] space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div>
              <h3 className="font-headline text-[28px] mb-8 border-b border-primary/10 pb-4">Filter Results</h3>
              <div className="space-y-10">
                <div className="space-y-5">
                  <h4 className="text-[13.5px] font-bold uppercase tracking-widest text-primary">Categories</h4>
                  <div className="space-y-4">
                    {['Wedding Venues', 'Photographers', 'Bridal Wear', 'Catering', 'Floral Design', 'Beauty & Hair', 'Music & DJ'].map((cat) => (
                      <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id={cat} className="rounded-full border-primary/40 w-4.5 h-4.5" />
                        <label htmlFor={cat} className="text-[16px] font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/80">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-primary/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[13.5px] font-bold uppercase tracking-widest text-primary">Price Range</h4>
                    <span className="text-[14px] font-bold text-foreground/60">R10k – R50k+</span>
                  </div>
                  <Slider defaultValue={[20000]} max={100000} step={1000} className="py-2" />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[20px] border border-primary/10 text-center shadow-md">
              <h3 className="font-headline text-[22px] mb-4">Apply as a Vendor</h3>
              <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed font-medium">Join South Africa's most elite wedding vendor network.</p>
              <Button asChild className="w-full button-rose h-12 text-[14px]">
                <Link href="/apply">REGISTER NOW</Link>
              </Button>
            </div>
          </aside>

          {/* Vendor Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <h2 className="font-headline text-[42px] md:text-[48px]">Premium Vendors</h2>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
              </div>
              <p className="text-[15.5px] text-muted-foreground italic font-medium">Showing 142 luxury vendors in South Africa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[36px]">
              {FEATURED_VENDORS.map((vendor) => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>

            <div className="mt-20 text-center">
              <Button variant="outline" className="rounded-full px-16 h-14 border-primary/30 text-primary hover:bg-primary/5 uppercase font-bold tracking-widest text-[13px]">
                LOAD MORE VENDORS
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="bg-white/60 section-padding px-6 border-y border-primary/10 relative overflow-hidden">
        <div className="floral-texture absolute inset-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-headline text-[48px] mb-4">Why InFaith Journey?</h2>
            <p className="text-[15px] text-primary/70 tracking-[0.2em] uppercase font-bold">The standard of excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: "Curated Selection", desc: "We only list the most reliable and premium vendors in South Africa after a strict review process." },
              { title: "Direct Inquiries", desc: "Connect directly with business owners without any commission fees or middle-man interference." },
              { title: "Secure Planning", desc: "Our platform ensures a safe, high-end environment for your luxury wedding planning journey." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 border border-primary/20 rounded-full flex items-center justify-center mb-8 bg-white shadow-md">
                  <span className="text-primary font-headline text-[32px]">{i + 1}</span>
                </div>
                <h3 className="font-headline text-[26px] mb-6">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[16.5px] font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
