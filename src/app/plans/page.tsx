
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Check, X, Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export default function PlansPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-apply');

  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Vendor membership hero"
          fill
          className="object-cover sepia-overlay brightness-[0.6]"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-[48px] md:text-[64px] font-headline mb-4 drop-shadow-lg">Vendor Membership Plans</h1>
          <p className="text-[18px] md:text-[22px] italic mb-10 opacity-95">
            Choose a plan that fits your business and start connecting with couples planning weddings & events.
          </p>
          <Button asChild className="button-rose h-16 px-12 text-[16px]">
            <Link href="/apply">APPLY AS A VENDOR</Link>
          </Button>
          <p className="mt-4 text-[13px] opacity-80 italic">*Application required before listing goes live.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 items-stretch">
          {/* FREE LISTING */}
          <div className="bg-white rounded-[24px] p-10 border border-primary/10 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-headline text-[24px] mb-2 uppercase tracking-wide">FREE LISTING</h3>
            <p className="text-[14px] text-muted-foreground mb-6">Get listed. Get discovered.</p>
            <div className="text-[48px] font-bold mb-8">Free</div>
            
            <div className="w-full space-y-4 mb-10 flex-1">
              {[
                { label: 'Business name', included: true },
                { label: '1 category', included: true },
                { label: 'Location', included: true },
                { label: 'Short description', included: true },
                { label: '"Listed on InFaith Journey" badge', included: true },
                { label: 'Contact details', included: false },
                { label: 'Inquiry form', included: false },
                { label: 'Search visibility', included: false },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  {item.included ? (
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                  )}
                  <span className={item.included ? 'text-[15px] text-foreground font-medium' : 'text-[15px] text-muted-foreground/40 line-through'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[12px] italic text-muted-foreground mb-4">Included with application</p>
          </div>

          {/* STANDARD VENDOR */}
          <div className="bg-white rounded-[24px] p-10 border-2 border-primary shadow-xl flex flex-col items-center text-center relative md:scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
              <Star className="w-4 h-4 fill-white" /> Recommended
            </div>
            <h3 className="font-headline text-[24px] mb-2 uppercase tracking-wide">STANDARD VENDOR</h3>
            <p className="text-[14px] text-muted-foreground mb-6">Start receiving real inquiries</p>
            <div className="mb-8">
              <div className="text-[42px] font-bold leading-none">R499</div>
              <div className="text-[16px] text-muted-foreground mt-1">/ month or R4,999 / year</div>
            </div>
            
            <div className="w-full space-y-4 mb-10 flex-1">
              {[
                'Full profile & contact details',
                'Up to 10 images',
                'Appear in search results',
                'Verified vendor badge',
                'Seasonal & event visibility',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-[15px] text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Button asChild className="button-rose w-full h-14 mb-4 text-[15px] font-bold">
              <Link href="/apply">APPLY AS A VENDOR</Link>
            </Button>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground italic">Billed manually & securely after approval</p>
              <p className="text-[10px] text-muted-foreground italic">Included with application</p>
            </div>
          </div>

          {/* FEATURED VENDOR */}
          <div className="bg-white rounded-[24px] p-10 border border-primary/10 shadow-sm flex flex-col items-center text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
              <Star className="w-4 h-4 fill-white" /> Most Visibility
            </div>
            <h3 className="font-headline text-[24px] mb-2 uppercase tracking-wide">FEATURED VENDOR</h3>
            <p className="text-[14px] text-muted-foreground mb-6">Maximise exposure & priority placement</p>
            <div className="mb-8">
              <div className="text-[42px] font-bold leading-none">R1,199</div>
              <div className="text-[16px] text-muted-foreground mt-1">/ month or R11,999 / year</div>
            </div>
            
            <div className="w-full space-y-4 mb-10 flex-1">
              {[
                'All Standard features + AI Standard Vendor features',
                'Homepage & priority placement',
                '"Featured Vendor" badge',
                'Social mentions',
                'Limited availability',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-[15px] text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Button asChild className="button-rose w-full h-14 mb-4 text-[15px] font-bold">
              <Link href="/apply">APPLY AS A VENDOR</Link>
            </Button>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground italic">Billed manually & securely after approval</p>
              <p className="text-[10px] text-muted-foreground italic">Included with application</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-primary/5 rounded-[40px] p-12 md:p-24 text-center mb-24 border border-primary/5">
          <h2 className="font-headline text-[36px] md:text-[48px] mb-16 leading-tight">Join a trusted platform where real couples are looking for your services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left max-w-5xl mx-auto">
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-md shrink-0 border border-primary/5">
                  <Star className="w-7 h-7 fill-primary/10" />
                </div>
                <div>
                  <h4 className="font-headline text-[22px] mb-3">Build Your Brand</h4>
                  <p className="text-muted-foreground leading-relaxed text-[16px] font-medium opacity-90">Present your business in a premium environment designed for high-end wedding services.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-md shrink-0 border border-primary/5">
                  <Star className="w-7 h-7 fill-primary/10" />
                </div>
                <div>
                  <h4 className="font-headline text-[22px] mb-3">Direct Connections</h4>
                  <p className="text-muted-foreground leading-relaxed text-[16px] font-medium opacity-90">Couples can reach out to you directly, ensuring faster bookings and clear communication.</p>
                </div>
              </div>
            </div>
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-md shrink-0 border border-primary/5">
                  <Star className="w-7 h-7 fill-primary/10" />
                </div>
                <div>
                  <h4 className="font-headline text-[22px] mb-3">Targeted Exposure</h4>
                  <p className="text-muted-foreground leading-relaxed text-[16px] font-medium opacity-90">Reach your ideal client base through our curated categories and filtered search.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-md shrink-0 border border-primary/5">
                  <Star className="w-7 h-7 fill-primary/10" />
                </div>
                <div>
                  <h4 className="font-headline text-[22px] mb-3">Reliable Lead Generation</h4>
                  <p className="text-muted-foreground leading-relaxed text-[16px] font-medium opacity-90">Our platform is optimized to deliver consistent, high-quality inquiries to our listed vendors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-12">
          <h2 className="font-headline text-[48px] md:text-[64px] mb-6 tracking-tight">Ready to get more inquiries?</h2>
          <p className="text-[20px] md:text-[24px] italic mb-12 text-muted-foreground font-medium">Apply today and start your journey with InFaith.</p>
          <Button asChild className="button-rose h-20 px-20 text-[20px] shadow-2xl golden-glow-premium">
            <Link href="/apply">APPLY AS A VENDOR</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
