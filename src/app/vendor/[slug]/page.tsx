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
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || ''}
          alt="Evergold Photography"
          fill
          className="object-cover sepia-overlay brightness-[0.7]"
          data-ai-hint="wedding photography"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent"></div>
        <div className="absolute bottom-20 left-0 w-full px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="space-y-6">
              <Badge className="bg-primary text-white border-none px-6 py-2.5 uppercase tracking-[0.3em] font-bold text-[10px] shadow-xl">
                PHOTOGRAPHY
              </Badge>
              <h1 className="text-6xl md:text-8xl font-headline text-white drop-shadow-2xl">Evergold Photography</h1>
              <div className="flex flex-wrap items-center gap-10 text-white/90">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <span className="text-xl font-medium tracking-wide">Johannesburg, Gauteng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <span className="font-bold text-lg ml-2">4.9</span>
                  <span className="opacity-70 text-lg ml-1">(120 Reviews)</span>
                </div>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-xl px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border border-white/30 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                  Listed on InFaith Journey
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-5 w-full md:w-auto">
              <Button size="lg" className="rounded-full button-rose px-14 h-16 text-[13px] font-bold tracking-[0.3em] uppercase shadow-2xl">
                REQUEST A QUOTE
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full border-white/50 text-white hover:bg-white/20 h-16 w-16 backdrop-blur-md shadow-xl">
                  <Phone className="w-6 h-6" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-white/50 text-white hover:bg-white/20 h-16 w-16 backdrop-blur-md shadow-xl">
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <main className="max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-24">
            {/* Gallery Grid */}
            <div className="space-y-12">
              <h2 className="font-headline text-5xl">Portfolio Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                    <Image
                      src={img?.imageUrl || ''}
                      alt={`Gallery ${i+1}`}
                      fill
                      className="object-cover sepia-overlay transition-transform duration-1000 group-hover:scale-115"
                      data-ai-hint={img?.imageHint}
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="space-y-8">
              <h2 className="font-headline text-5xl">About Evergold Photography</h2>
              <div className="w-24 h-1.5 bg-primary rounded-full"></div>
              <p className="text-muted-foreground leading-[1.8] text-xl font-medium">
                We believe that every wedding is a unique story waiting to be told. With over a decade of experience in high-end South African weddings, Evergold Photography focuses on capturing the raw emotion, natural light, and sophisticated details of your romantic journey. 
              </p>
              <p className="text-muted-foreground leading-[1.8] text-xl font-medium">
                Our approach is a blend of fine-art photography and cinematic storytelling. We are inspired by the soft golden-hour light of the Cape Winelands and the elegant energy of Johannesburg weddings. Our goal is to provide you with a timeless collection of memories that you will cherish for a lifetime.
              </p>
            </div>

            {/* Services Checklist */}
            <div className="bg-primary/5 p-14 rounded-3xl border border-primary/10 relative overflow-hidden">
              <div className="font-script text-[180px] text-primary/5 absolute -right-20 -bottom-20 rotate-12 select-none">Evergold</div>
              <h2 className="font-headline text-4xl mb-12">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
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
                  <div key={i} className="flex items-center gap-4 group">
                    <CheckCircle2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-foreground/80 tracking-wide text-lg">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Inquiry Form */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-12">
              <div className="luxury-card p-12 relative">
                <h3 className="font-headline text-4xl mb-12 text-center">Inquire Now</h3>
                <form className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="q_name" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Your Name</Label>
                    <Input id="q_name" placeholder="Full Name" className="bg-white/50 border-primary/10 h-14 rounded-xl px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="q_email" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Email Address</Label>
                    <Input id="q_email" type="email" placeholder="email@address.com" className="bg-white/50 border-primary/10 h-14 rounded-xl px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="q_date" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Wedding Date</Label>
                    <Input id="q_date" type="date" className="bg-white/50 border-primary/10 h-14 rounded-xl px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="q_message" className="uppercase text-[11px] tracking-widest font-bold opacity-60">Message</Label>
                    <Textarea id="q_message" placeholder="Tell them about your wedding..." className="bg-white/50 border-primary/10 min-h-[140px] rounded-xl px-6 py-4" />
                  </div>
                  <Button className="w-full h-16 button-rose text-[14px] font-bold tracking-[0.3em] uppercase rounded-full">
                    SEND INQUIRY
                  </Button>
                </form>
              </div>

              {/* Social row */}
              <div className="flex justify-center gap-8">
                {[Instagram, Facebook, Mail].map((Icon, i) => (
                  <button key={i} className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-xl hover:-translate-y-2 duration-300">
                    <Icon className="w-6 h-6" />
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
