
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChat } from '@/components/ai/AIChat';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Bot, Sparkles, Wand2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AIPlannerPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Subtle Hero Header */}
      <section className="relative h-[40vh] md:h-[40vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Golden hour wedding aesthetic"
          fill
          className={`object-cover sepia-overlay brightness-[0.6] transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority
          data-ai-hint="wedding sunset"
        />
        {/* Soft Linear Gradient Overlay */}
        <div className="absolute inset-0 luxury-gradient-overlay opacity-80 backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl pt-44 md:pt-0">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
             <div className="p-2 bg-primary/10 backdrop-blur-sm rounded-full">
               <Bot className="w-8 h-8 md:w-10 md:h-10 text-primary" />
             </div>
             <h1 className="text-[32px] md:text-[54px] font-headline leading-tight">AI Wedding Concierge</h1>
          </div>
          <p className="text-[14px] md:text-[18px] italic tracking-widest font-medium opacity-95">Your magical planning journey begins here</p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
          
          {/* Info Column */}
          <div className="lg:col-span-1 space-y-8 md:space-y-10">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <h2 className="font-headline text-[28px] md:text-[32px]">How I Can Help</h2>
              <div className="w-16 h-1.5 bg-secondary rounded-full mx-auto lg:mx-0"></div>
              <p className="text-[15px] md:text-[16px] text-muted-foreground leading-relaxed italic">
                As your personal wedding concierge, I can help you navigate through our curated selections of elite vendors in South Africa.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {[
                { title: "Find Venues", desc: "Search by location, style, or budget." },
                { title: "Match Styles", desc: "Discover vendors that match your romantic vision." },
                { title: "Plan Logistics", desc: "Estimate guest counts and event flow." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-primary/10 shadow-sm golden-glow-premium bg-white/40">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[13px] md:text-[15px] uppercase tracking-wider mb-1">{item.title}</h3>
                    <p className="text-[12px] md:text-[13px] text-muted-foreground italic leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8 bg-primary/5 rounded-[24px] md:rounded-[28px] border border-primary/10 text-center italic text-[13px] md:text-sm text-primary/70">
              <Sparkles className="w-5 md:w-6 h-5 md:h-6 mx-auto mb-3 md:mb-4 opacity-50" />
              "Planning should be as beautiful as the wedding day itself."
            </div>
          </div>

          {/* Chat Column */}
          <div className="lg:col-span-2 h-[550px] md:h-[750px] shadow-2xl rounded-[24px] md:rounded-[32px] overflow-hidden border border-primary/10 bg-white">
            <AIChat inline initialOpen={true} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
