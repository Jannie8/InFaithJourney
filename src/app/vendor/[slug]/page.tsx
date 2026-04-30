
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Star, MapPin, Share2, Phone, Mail, Instagram, Facebook } from 'lucide-react';
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
      
      {/* Hero Banner */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={PlaceHolderImages.find(img => img.id === 'hero-home')?.imageUrl || ''}
          alt="Evergold Photography"
          fill
          className="object-cover sepia-overlay brightness-[0.7]"
          data-ai-hint="wedding couple"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4">
              <Badge className="bg-primary text-white border-none px-4 py-1 uppercase tracking-[0.2em] font-bold">
                PHOTOGRAPHY
              </Badge>
              <h1 className="text-5xl md:text-7xl font-headline text-white drop-shadow-lg">Evergold Photography</h1>
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Johannesburg, Gauteng</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-bold">4.9</span>
                  <span className="opacity-70">(120 Reviews)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  Listed on InFaith Journey
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-10 h-14 text-white font-bold tracking-widest uppercase shadow-xl shadow-primary/20">
                REQUEST A QUOTE
              </Button>
              <div className="flex gap-2">
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
      <main className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            {/* Gallery Grid */}
            <div className="space-y-8">
              <h2 className="font-headline text-3xl">Portfolio Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer">
                    <Image
                      src={img?.imageUrl || ''}
                      alt={`Gallery ${i+1}`}
                      fill
                      className="object-cover sepia-overlay transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={img?.imageHint}
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="space-y-6">
              <h2 className="font-headline text-3xl">About Evergold Photography</h2>
              <div className="w-20 h-1 bg-primary rounded-full"></div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We believe that every wedding is a unique story waiting to be told. With over a decade of experience in high-end South African weddings, Evergold Photography focuses on capturing the raw emotion, natural light, and sophisticated details of your romantic journey. 
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Our approach is a blend of fine-art photography and cinematic storytelling. We are inspired by the soft golden-hour light of the Cape Winelands and the elegant energy of Johannesburg weddings. Our goal is to provide you with a timeless collection of memories that you will cherish for a lifetime.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-8 bg-primary/5 p-10 rounded-3xl border border-primary/10">
              <h2 className="font-headline text-3xl">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                    </div>
                    <span className="font-medium text-foreground/80">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Inquiry */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-10">
              <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-2xl shadow-primary/5">
                <h3 className="font-headline text-2xl mb-8 text-center">Inquire Now</h3>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="q_name">Your Name</Label>
                    <Input id="q_name" placeholder="Full Name" className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q_email">Email Address</Label>
                    <Input id="q_email" type="email" placeholder="email@address.com" className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q_date">Wedding Date</Label>
                    <Input id="q_date" type="date" className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q_message">Message</Label>
                    <Textarea id="q_message" placeholder="Tell them about your wedding..." className="border-primary/20 min-h-[100px]" />
                  </div>
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase rounded-full">
                    SEND INQUIRY
                  </Button>
                </form>
              </div>

              <div className="flex justify-center gap-6">
                {[Instagram, Facebook, Mail].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
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
