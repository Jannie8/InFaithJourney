
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getVendorById, vendorFromFirestore } from '@/lib/vendors';
import Image from 'next/image';
import { Star, MapPin, Share2, Phone, Mail, Instagram, CheckCircle2, Globe, Banknote, Calendar, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function VendorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [inquiry, setInquiry] = useState({ name: '', email: '', weddingDate: '', message: '' });
  const db = useFirestore();
  const { toast } = useToast();
  const liveVendorRef = useMemoFirebase(() => db ? doc(db, 'vendors', slug) : null, [db, slug]);
  const { data: liveVendor } = useDoc<any>(liveVendorRef);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (liveVendor?.membershipStatus !== 'active') return;
    const key = `vendor-view:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    fetch('/api/vendor-analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId: slug }),
    }).catch(() => sessionStorage.removeItem(key));
  }, [liveVendor?.membershipStatus, slug]);

  // Resolve the vendor that was actually clicked. Falls back to a sensible
  // default if the id is unknown so the page never breaks.
  const staticVendor = getVendorById(slug);
  const vendor = liveVendor?.membershipStatus === 'active'
    ? { ...liveVendor, ...vendorFromFirestore(slug, liveVendor) }
    : staticVendor ?? {
    name: 'Evergold Photography',
    location: 'Johannesburg',
    category: 'Photography',
    rating: 4.9,
    imageUrl: PlaceHolderImages.find(img => img.id === 'vendor-evergold')?.imageUrl || '',
    imageHint: 'wedding photography',
  };
  const ratingStars = Math.round(vendor.rating);

  const submittedGallery = 'portfolioImageUrls' in vendor && Array.isArray(vendor.portfolioImageUrls)
    ? vendor.portfolioImageUrls.filter((url: unknown): url is string => typeof url === 'string' && url.length > 0)
    : [];
  const gallery = submittedGallery.length > 0
    ? submittedGallery.map((imageUrl: string) => ({ imageUrl }))
    : [
        PlaceHolderImages.find(img => img.id === 'gallery-1'),
        PlaceHolderImages.find(img => img.id === 'gallery-2'),
        PlaceHolderImages.find(img => img.id === 'gallery-3'),
        PlaceHolderImages.find(img => img.id === 'gallery-4'),
        PlaceHolderImages.find(img => img.id === 'gallery-5'),
        PlaceHolderImages.find(img => img.id === 'gallery-6'),
      ];

  const services = 'servicesOffered' in vendor && typeof vendor.servicesOffered === 'string'
    ? vendor.servicesOffered.split(/\r?\n|;/).map((service: string) => service.trim()).filter(Boolean)
    : [];
  const phoneNumber = 'phoneNumber' in vendor && typeof vendor.phoneNumber === 'string' ? vendor.phoneNumber : '';
  const instagramHandle = 'instagramHandle' in vendor && typeof vendor.instagramHandle === 'string' ? vendor.instagramHandle : '';
  const instagramUrl = vendor.membershipTier === 'featured' && instagramHandle
    ? instagramHandle.startsWith('http') ? instagramHandle : `https://instagram.com/${instagramHandle.replace(/^@/, '')}`
    : '';
  const websiteUrl = 'websiteUrl' in vendor && typeof vendor.websiteUrl === 'string' && vendor.websiteUrl
    ? vendor.websiteUrl.startsWith('http') ? vendor.websiteUrl : `https://${vendor.websiteUrl}`
    : '';

  const scrollToInquiry = () => {
    document.getElementById('vendor-inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => document.getElementById('inquiry-name')?.focus(), 500);
  };

  const shareVendor = async () => {
    const shareData = { title: vendor.name, text: `View ${vendor.name} on InFaith Journey`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: 'Link copied', description: 'The vendor profile link is ready to share.' });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      toast({ title: 'Could not share', description: 'Please copy the page address from your browser.', variant: 'destructive' });
    }
  };

  const sendInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!db) return;
    try {
      setIsSendingInquiry(true);
      const response = await fetch('/api/vendor-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: slug,
          name: inquiry.name.trim(),
          email: inquiry.email.trim(),
          weddingDate: inquiry.weddingDate,
          message: inquiry.message.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your inquiry.');
      setInquiry({ name: '', email: '', weddingDate: '', message: '' });
      toast({
        title: 'Inquiry sent',
        description: result.emailSent
          ? `${vendor.name} has been notified by email.`
          : `Your inquiry was saved for ${vendor.name}, but their email notification is temporarily delayed.`,
      });
    } catch (error: any) {
      toast({ title: 'Inquiry not sent', description: error?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSendingInquiry(false);
    }
  };

  useEffect(() => {
    if (selectedPhoto === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
      if (event.key === 'ArrowLeft') setSelectedPhoto(current => current === null ? null : (current - 1 + gallery.length) % gallery.length);
      if (event.key === 'ArrowRight') setSelectedPhoto(current => current === null ? null : (current + 1) % gallery.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gallery.length, selectedPhoto]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Large Hero Banner */}
      <section className="relative min-h-[70vh] md:h-[65vh] w-full overflow-hidden">
        <Image
          src={vendor.imageUrl}
          alt={vendor.name}
          fill
          className={`object-cover sepia-overlay brightness-[0.6] transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          data-ai-hint={vendor.imageHint}
          priority
        />
        {/* Soft Linear Gradient Overlay */}
        <div className="absolute inset-0 luxury-gradient-overlay opacity-85"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EF]/20 via-black/10 to-transparent"></div>
        <div className="absolute bottom-10 md:bottom-16 left-0 w-full px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-8 md:gap-10 text-center md:text-left">
            <div className="space-y-4 md:space-y-6 pt-56 md:pt-0">
              {'logoUrl' in vendor && typeof vendor.logoUrl === 'string' && vendor.logoUrl && (
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto md:mx-0 bg-white">
                  <Image src={vendor.logoUrl} alt={`${vendor.name} profile picture`} fill className="object-cover" sizes="96px" />
                </div>
              )}
              <div className="flex justify-center md:justify-start">
                <Badge className="bg-primary text-white border-none px-5 py-2 uppercase tracking-widest font-bold text-[10px] md:text-[11px] shadow-xl">
                  {vendor.category}
                </Badge>
              </div>
              <h1 className="text-[36px] md:text-[64px] font-headline text-white drop-shadow-2xl leading-tight">{vendor.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-white/90">
                <div className="flex items-center gap-2 drop-shadow-md">
                  <MapPin className="w-4 md:w-5 h-4 md:w-5 text-primary" />
                  <span className="text-[16px] md:text-[18px] font-medium tracking-wide">{vendor.location}</span>
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 md:w-4 h-3.5 md:h-4 ${i < ratingStars ? 'fill-secondary text-secondary' : 'text-white/40'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-[16px] md:text-[18px] ml-1">{vendor.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button onClick={scrollToInquiry} size="lg" className="rounded-full button-rose px-10 md:px-12 h-12 md:h-14 text-[14px] md:text-[15px] font-semibold w-full sm:w-auto">
                REQUEST A QUOTE
              </Button>
              <div className="flex gap-3 justify-center">
                {phoneNumber && (
                  <Button asChild variant="outline" size="icon" className="rounded-full border-white/50 text-white hover:bg-white/20 h-12 md:h-14 w-12 md:w-14 backdrop-blur-md shrink-0">
                    <a href={`tel:${phoneNumber.replace(/[^+\d]/g, '')}`} aria-label={`Call ${vendor.name}`}><Phone className="w-5 h-5" /></a>
                  </Button>
                )}
                <Button onClick={shareVendor} variant="outline" size="icon" aria-label={`Share ${vendor.name}`} className="rounded-full border-white/50 text-white hover:bg-white/20 h-12 md:h-14 w-12 md:w-14 backdrop-blur-md shrink-0">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <main className="max-w-7xl mx-auto px-6 section-padding w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-[36px]">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            {/* Gallery Grid */}
            <div className="space-y-6 md:space-y-8">
              <h2 className="font-headline text-[28px] md:text-[36px]">Portfolio Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {gallery.map((img: { imageUrl?: string } | undefined, i: number) => (
                  <button type="button" key={i} onClick={() => setSelectedPhoto(i)} aria-label={`Open portfolio photo ${i + 1}`} className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-zoom-in shadow-md">
                    <Image
                      src={img?.imageUrl || ''}
                      alt={`Gallery ${i+1}`}
                      fill
                      className="object-cover sepia-overlay transition-transform duration-700 group-hover:scale-105"
                      data-ai-hint="wedding portfolio"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="space-y-6">
              <h2 className="font-headline text-[28px] md:text-[36px]">About {vendor.name}</h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
              <p className="text-foreground/90 leading-[1.8] text-[16px] md:text-[18px] font-medium italic">
                {'description' in vendor && vendor.description
                  ? vendor.description
                  : `We believe that every wedding is a unique story waiting to be told. ${vendor.name} focuses on the natural beauty and sophisticated details of your romantic journey.`}
              </p>
            </div>

            {/* Services Checklist */}
            <div className="p-8 md:p-12 rounded-2xl border border-primary/10 relative overflow-hidden shadow-md">
              <h2 className="font-headline text-[24px] md:text-[32px] mb-6 md:mb-8">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
                {(services.length > 0 ? services : [
                  'Contact this vendor to discuss their wedding services and packages.',
                ]).map((service: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 md:w-5 h-4 md:w-5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground/80 tracking-wide text-[15px] md:text-[16.5px]">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {('pricingRange' in vendor || 'yearsInBusiness' in vendor || websiteUrl || instagramUrl || phoneNumber) && (
              <div className="p-8 md:p-10 rounded-2xl border border-primary/10 shadow-md space-y-6">
                <h2 className="font-headline text-[24px] md:text-[32px]">Business Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {'pricingRange' in vendor && vendor.pricingRange && <ProfileDetail icon={Banknote} label="Pricing range" value={vendor.pricingRange} />}
                  {'yearsInBusiness' in vendor && vendor.yearsInBusiness && <ProfileDetail icon={Calendar} label="Years in business" value={vendor.yearsInBusiness} />}
                  {phoneNumber && <ProfileDetail icon={Phone} label="Phone" value={phoneNumber} href={`tel:${phoneNumber.replace(/[^+\d]/g, '')}`} />}
                  {'email' in vendor && vendor.email && <ProfileDetail icon={Mail} label="Email" value={vendor.email} href={`mailto:${vendor.email}`} />}
                  {websiteUrl && <ProfileDetail icon={Globe} label="Website" value={vendor.websiteUrl} href={websiteUrl} external />}
                  {instagramUrl && <ProfileDetail icon={Instagram} label="Instagram" value={instagramHandle} href={instagramUrl} external />}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Inquiry Form */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-10">
              <div id="vendor-inquiry" className="p-8 md:p-10 rounded-[20px] border border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm scroll-mt-32">
                <h3 className="font-headline text-[24px] md:text-[28px] mb-6 md:mb-8 text-center">Inquire Now</h3>
                <form onSubmit={sendInquiry} className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] md:text-[12px] tracking-widest font-bold text-foreground/70">Your Name</Label>
                    <Input id="inquiry-name" value={inquiry.name} onChange={event => setInquiry(current => ({ ...current, name: event.target.value }))} className="h-12 rounded-xl px-4 border-primary/10 bg-transparent text-[15px]" placeholder="Full Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] md:text-[12px] tracking-widest font-bold text-foreground/70">Email Address</Label>
                    <Input type="email" value={inquiry.email} onChange={event => setInquiry(current => ({ ...current, email: event.target.value }))} className="h-12 rounded-xl px-4 border-primary/10 bg-transparent text-[16px]" placeholder="email@address.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] md:text-[12px] tracking-widest font-bold text-foreground/70">Wedding Date</Label>
                    <Input type="date" value={inquiry.weddingDate} onChange={event => setInquiry(current => ({ ...current, weddingDate: event.target.value }))} className="h-12 rounded-xl px-4 border-primary/10 bg-transparent text-[16px]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] md:text-[12px] tracking-widest font-bold text-foreground/70">Message</Label>
                    <Textarea value={inquiry.message} onChange={event => setInquiry(current => ({ ...current, message: event.target.value }))} className="min-h-[100px] md:min-h-[120px] rounded-xl px-4 py-3 border-primary/10 bg-transparent text-[15px]" placeholder="Tell them about your wedding..." required />
                  </div>
                  <Button disabled={isSendingInquiry} className="w-full h-12 md:h-14 button-rose text-[14px] md:text-[15px] font-semibold">
                    {isSendingInquiry ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEND INQUIRY'}
                  </Button>
                </form>
              </div>

              {/* Social row */}
              <div className="flex justify-center gap-4 md:gap-6">
                {[
                  ...(instagramUrl ? [{ Icon: Instagram, href: instagramUrl, label: `${vendor.name} on Instagram` }] : []),
                  ...('email' in vendor && vendor.email ? [{ Icon: Mail, href: `mailto:${vendor.email}`, label: `Email ${vendor.name}` }] : []),
                  ...(websiteUrl ? [{ Icon: Globe, href: websiteUrl, label: `${vendor.name} website` }] : []),
                ].map((social, i) => (
                  <Link 
                    key={i} 
                    href={social.href}
                    target={social.href.startsWith('http') ? "_blank" : undefined}
                    rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-md"
                  >
                    <social.Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {selectedPhoto !== null && gallery[selectedPhoto]?.imageUrl && (
        <div role="dialog" aria-modal="true" aria-label={`Portfolio photo ${selectedPhoto + 1}`} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 md:p-10" onClick={() => setSelectedPhoto(null)}>
          <button type="button" onClick={() => setSelectedPhoto(null)} aria-label="Close photo viewer" className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
            <X className="h-6 w-6" />
          </button>
          {gallery.length > 1 && (
            <>
              <button type="button" onClick={event => { event.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + gallery.length) % gallery.length); }} aria-label="Previous photo" className="absolute left-3 md:left-8 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button type="button" onClick={event => { event.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % gallery.length); }} aria-label="Next photo" className="absolute right-3 md:right-8 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
          <div className="relative h-full w-full max-w-6xl" onClick={event => event.stopPropagation()}>
            <Image src={gallery[selectedPhoto].imageUrl} alt={`Portfolio photo ${selectedPhoto + 1} for ${vendor.name}`} fill sizes="100vw" className="object-contain" priority />
          </div>
          <span className="absolute bottom-5 rounded-full bg-black/50 px-4 py-2 text-xs font-bold text-white">{selectedPhoto + 1} / {gallery.length}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}

function ProfileDetail({ icon: Icon, label, value, href, external = false }: { icon: any; label: string; value: string; href?: string; external?: boolean }) {
  const content = <span className="break-words text-sm font-semibold">{value}</span>;
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        {href ? <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="text-primary hover:underline">{content}</a> : content}
      </div>
    </div>
  );
}
