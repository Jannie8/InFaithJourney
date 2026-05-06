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
    <div className="flex flex-col min-h-screen watercolor-bg pt-[64px]">
      <Navbar />
      
      {/* Light Hero Section */}
      <section className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden bg-muted/30">
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-[42px] md:text-[54px] font-headline mb-4 text-foreground">Vendor Membership Plans</h1>
          <p className="text-[17px] md:text-[20px] italic mb-10 text-muted-foreground font-medium">
            Choose a plan that fits your business and start connecting with couples planning their dream weddings.
          </p>
          <Button asChild className="button-rose h-14 px-12 text-[15px]">
            <Link href="/apply">APPLY AS A VENDOR</Link>
          </Button>
          <p className="mt-4 text-[12px] text-muted-foreground italic">*Application required before listing goes live.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 section-padding w-full">
        {/* Editorial Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24 items-stretch">
          {/* FREE LISTING */}
          <div className="bg-card rounded-[24px] p-10 border border-border shadow-soft flex flex-col items-center text-center">
            <h3 className="font-headline text-[22px] mb-2 uppercase tracking-wide text-foreground">FREE LISTING</h3>
            <p className="text-[13px] text-muted-foreground mb-6">Get discovered by local couples.</p>
            <div className="text-[42px] font-bold mb-8 text-foreground">Free</div>
            
            <div className="w-full space-y-4 mb-10 flex-1">
              {[
                { label: 'Business name', included: true },
                { label: '1 category', included: true },
                { label: 'Location', included: true },
                { label: 'Short description', included: true },
                { label: 'Basic Badge', included: true },
                { label: 'Contact details', included: false },
                { label: 'Inquiry form', included: false },
                { label: 'Search visibility', included: false },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  {item.included ? (
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                  )}
                  <span className={item.included ? 'text-[14px] text-foreground font-medium' : 'text-[14px] text-muted-foreground/40 line-through'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] italic text-muted-foreground">Included with initial application</p>
          </div>

          {/* STANDARD VENDOR */}
          <div className="bg-card rounded-[24px] p-10 border-2 border-primary shadow-lg flex flex-col items-center text-center relative md:scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-md">
              <Star className="w-3.5 h-3.5 fill-white" /> Recommended
            </div>
            <h3 className="font-headline text-[22px] mb-2 uppercase tracking-wide text-foreground">STANDARD VENDOR</h3>
            <p className="text-[13px] text-muted-foreground mb-6">Start receiving direct inquiries.</p>
            <div className="mb-8">
              <div className="text-[42px] font-bold leading-none text-foreground">R499</div>
              <div className="text-[15px] text-muted-foreground mt-1">/ mo or R4,999 / yr</div>
            </div>
            
            <div className="w-full space-y-4 mb-10 flex-1">
              {[
                'Full profile & contact details',
                'Up to 10 images gallery',
                'Priority in search results',
                'Verified vendor badge',
                'Seasonal event visibility',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-[14px] text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Button asChild className="button-rose w-full h-14 mb-4 text-[14px] font-bold">
              <Link href="/apply">CHOOSE PLAN</Link>
            </Button>
          </div>

          {/* FEATURED VENDOR */}
          <div className="bg-card rounded-[24px] p-10 border border-border shadow-soft flex flex-col items-center text-center">
            <h3 className="font-headline text-[22px] mb-2 uppercase tracking-wide text-foreground">FEATURED VENDOR</h3>
            <p className="text-[13px] text-muted-foreground mb-6">Maximum exposure for elite brands.</p>
            <div className="mb-8">
              <div className="text-[42px] font-bold leading-none text-foreground">R1,199</div>
              <div className="text-[15px] text-muted-foreground mt-1">/ mo or R11,999 / yr</div>
            </div>
            
            <div className="w-full space-y-4 mb-10 flex-1">
              {[
                'Everything in Standard',
                'Homepage spotlight',
                'AI Concierge priority',
                'Social media feature',
                'Limited featured spots',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-[14px] text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Button asChild className="button-rose w-full h-14 mb-4 text-[14px] font-bold">
              <Link href="/apply">GET FEATURED</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
