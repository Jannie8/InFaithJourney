"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Target, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const BENEFITS = [
  {
    title: "Highly Targeted Audience",
    description: "Connect exclusively with high-end couples actively seeking premium wedding services in South Africa and beyond.",
    icon: Target
  },
  {
    title: "Elegant Brand Presentation",
    description: "Showcase your portfolio in an editorial-grade profile designed to mirror the sophistication of your services.",
    icon: Sparkles
  },
  {
    title: "AI-Powered Recommendations",
    description: "Our intelligent concierge matches your specific expertise with couples' unique romantic visions.",
    icon: Zap
  },
  {
    title: "Verified Trust",
    description: "Join a curated circle of excellence. Our verification badge signals reliability and quality to every visitor.",
    icon: ShieldCheck
  }
];

const PLANS = [
  {
    name: "Free Listing",
    price: "Free",
    description: "Get discovered by local couples.",
    features: ["Business name", "1 category", "Location", "Short description"],
    disabled: ["Contact details", "Inquiry form", "Search visibility"],
    button: "GET STARTED",
    highlight: false
  },
  {
    name: "Standard Vendor",
    price: "R499",
    period: "/ mo or R4,999 / yr",
    description: "Start receiving direct inquiries.",
    features: [
      "Full profile & contact details",
      "Up to 10 images",
      "Appear in search results",
      "Verified vendor badge",
      "Seasonal & event visibility"
    ],
    badge: "RECOMMENDED",
    button: "APPLY AS A VENDOR",
    highlight: true
  },
  {
    name: "Featured Vendor",
    price: "R1,199",
    period: "/ mo or R11,999 / yr",
    description: "Maximum exposure for elite brands.",
    features: [
      "All Standard features",
      "Homepage priority placement",
      "Featured Vendor badge",
      "Social mentions",
      "Limited availability"
    ],
    badge: "MOST VISIBILITY",
    button: "APPLY AS A VENDOR",
    highlight: false
  }
];

export default function MembershipPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-apply');

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EE]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage?.imageUrl || ''}
            alt="Cinematic Wedding Aesthetic"
            fill
            className="object-cover brightness-[0.4] sepia-[0.1]"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-[48px] md:text-[82px] font-headline text-white mb-6 leading-tight drop-shadow-2xl">
              Vendor Membership Plans
            </h1>
            <p className="text-[18px] md:text-[22px] text-white/90 italic font-medium mb-12 max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
              Choose a plan that fits your business and start connecting with couples planning weddings & events.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button asChild className="h-16 px-16 button-rose text-[14px] font-bold tracking-[0.2em] shadow-2xl golden-glow-premium">
                <Link href="/apply">APPLY AS A VENDOR</Link>
              </Button>
              <p className="text-[11px] text-white/60 uppercase tracking-[0.2em] font-bold">
                *Application required before listing goes live
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 w-full">
        {/* Benefits Section */}
        <section className="section-padding px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="font-headline text-[42px] md:text-[54px] text-primary mb-6">Elevate Your Presence</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-8"></div>
            <p className="text-[18px] text-muted-foreground italic font-medium max-w-2xl mx-auto">
              Join an exclusive collective of the finest wedding professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {BENEFITS.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-8 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-secondary/20 flex items-center justify-center text-secondary shadow-soft group-hover:bg-secondary group-hover:text-white transition-all duration-500 shrink-0">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-headline text-[28px] text-primary">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[16px] font-medium opacity-90">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section-padding bg-white/40 border-y border-secondary/10 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="font-headline text-[42px] md:text-[54px] text-primary mb-6">The Collective Tiers</h2>
              <p className="text-[16px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Refined growth for your brand</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ y: -10 }}
                  className={cn(
                    "relative flex flex-col p-10 rounded-[32px] border transition-all duration-500 bg-white",
                    plan.highlight 
                      ? "border-secondary/40 shadow-2xl scale-105 z-10 ring-1 ring-secondary/20" 
                      : "border-secondary/10 shadow-soft"
                  )}
                >
                  {plan.badge && (
                    <div className={cn(
                      "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg",
                      plan.highlight ? "bg-secondary text-white" : "bg-primary text-white"
                    )}>
                      {plan.highlight && <Star className="w-3.5 h-3.5 fill-white" />}
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-center mb-10">
                    <h3 className="font-headline text-[24px] text-primary uppercase tracking-wide mb-4">{plan.name}</h3>
                    <p className="text-[13px] text-muted-foreground italic mb-6">{plan.description}</p>
                    <div className="flex flex-col items-center">
                      <span className="text-[48px] font-bold text-primary leading-none">{plan.price}</span>
                      {plan.period && (
                        <span className="text-[14px] text-muted-foreground mt-2 font-medium">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-5 mb-12">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-[14px] text-foreground/80 font-medium">{feature}</span>
                      </div>
                    ))}
                    {plan.disabled?.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3 opacity-30">
                        <Check className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-[14px] text-muted-foreground font-medium line-through">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className={cn(
                    "w-full h-14 rounded-full font-bold tracking-[0.2em] text-[12px] shadow-lg transition-all",
                    plan.highlight ? "button-rose" : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10"
                  )}>
                    <Link href={`/apply?plan=${plan.name.toLowerCase().split(' ')[0]}`}>
                      {plan.button}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-10"
          >
            <h2 className="font-headline text-[36px] md:text-[48px] text-primary">Ready to Join the Collective?</h2>
            <p className="text-[18px] text-muted-foreground italic font-medium">
              Start your journey with InFaith Journey today and reach the couples who value your artistry.
            </p>
            <Button asChild size="lg" className="h-16 px-16 button-rose text-[14px] font-bold tracking-[0.2em] shadow-xl">
              <Link href="/apply">BEGIN APPLICATION</Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
