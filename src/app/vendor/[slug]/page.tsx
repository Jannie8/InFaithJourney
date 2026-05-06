import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Star, MapPin, Share2, Phone, Mail, Instagram, Facebook, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { title: name };
}

export default function VendorProfilePage() {
  const gallery = [
    PlaceHolderImages.find(img => img.id === 'gallery-1'),
    PlaceHolderImages.find(img => img.id === 'gallery-2'),
    PlaceHolderImages.find(img => img.id === 'gallery-3'),
    PlaceHolderImages.find(img => img.id === 'gallery-4'),
    PlaceHolderImages.find(img => img.id === 'gallery-5'),
    PlaceHolderImages.find(img => img.id === 'gallery-6'),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Large Hero Banner */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <Image
          src={PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || ''}
          alt="Evergold Photography"
          fill
          className="object-cover sepia-overlay brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EF]/20 via-black/10 to-transparent"></div>
        <div className="absolute bottom-16 left-0 w-full px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-10">
            <div className="space-y-6">
              <Badge className="bg-primary text-white border-none px-5 py-2 uppercase tracking-widest font-bold text-[11px] shadow-xl">
                PHOTOGRAPHY
              </Badge>
              <h1 className="text-[48px] md:text-[64px] font-headline text-white drop-shadow-2xl leading-tight">Evergold Photography</h1>
              <div className="flex flex-wrap items-center gap-8 text-white/90">
                <div className="flex items-center gap-2 drop-shadow-md">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-[18px] font-medium tracking-wide">Johannesburg, Gauteng</span>
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <span className="font-bold text-[18px] ml-1">4.9</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Button size="lg" className="rounded-full button-rose px-12 h-14 text-[15px] font-semibold">
                REQUEST A QUOTE
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full border-white/50 text-white hover:bg-white/20 h-14 w-14 backdrop-blur-md">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-white/50 text-white hover:bg-white/20 h-14 w-14 backdrop-blur-md">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <main className="max-w-7xl mx-auto px-6 section-padding w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[36px]">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            {/* Gallery Grid */}
            <div className="space-y-8">
              <h2 className="font-headline text-[36px]">Portfolio Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer shadow-md">
                    <Image
                      src={img?.imageUrl || ''}
                      alt={`Gallery ${i+1}`}
                      fill
                      className="object-cover sepia-overlay transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="space-y-6">
              <h2 className="font-headline text-[36px]">About Evergold Photography</h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
              <p className="text-foreground/90 leading-[1.8] text-[18px] font-medium">
                We believe that every wedding is a unique story waiting to be told. With over a decade of experience in high-end South African weddings, Evergold Photography focuses on capturing the raw emotion, natural light, and sophisticated details of your romantic journey. 
              </p>
            </div>

            {/* Services Checklist */}
            <div className="p-12 rounded-2xl border border-primary/10 relative overflow-hidden shadow-md">
              <h2 className="font-headline text-[32px] mb-8">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {[
                  "Full-day Wedding Coverage",
                  "Engagement Portrait Sessions",
                  "Second Professional Photographer",
                  "High-Resolution Digital Gallery",
                  "Luxury Flush-Mount Albums",
                  "Same-Day Sneak Peeks",
                  "Destination Wedding Packages",
                  "Post-Wedding Couple Sessions"
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground/80 tracking-wide text-[16.5px]">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Inquiry Form */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-10">
              <div className="p-10 rounded-[20px] border border-primary/10 shadow-lg">
                <h3 className="font-headline text-[28px] mb-8 text-center">Inquire Now</h3>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Your Name</Label>
                    <Input className="h-12 rounded-xl px-4 border-primary/10 bg-transparent text-[16px]" placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Email Address</Label>
                    <Input type="email" className="h-12 rounded-xl px-4 border-primary/10 bg-transparent text-[16px]" placeholder="email@address.com" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Wedding Date</Label>
                    <Input type="date" className="h-12 rounded-xl px-4 border-primary/10 bg-transparent text-[16px]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Message</Label>
                    <Textarea className="min-h-[120px] rounded-xl px-4 py-3 border-primary/10 bg-transparent text-[16px]" placeholder="Tell them about your wedding..." />
                  </div>
                  <Button className="w-full h-14 button-rose text-[15px] font-semibold">
                    SEND INQUIRY
                  </Button>
                </form>
              </div>

              {/* Social row */}
              <div className="flex justify-center gap-6">
                {[Instagram, Facebook, Mail].map((Icon, i) => (
                  <button key={i} className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-md">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}