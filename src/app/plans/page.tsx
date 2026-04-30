
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Check, Star, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function PlansPage() {
  const plans = [
    {
      name: "FREE LISTING",
      price: "Free",
      features: [
        { text: "Basic Profile Listing", included: true },
        { text: "Up to 5 Portfolio Images", included: true },
        { text: "Standard Search Results", included: true },
        { text: "Direct Inquiries", included: true },
        { text: "Featured Placement", included: false },
        { text: "Priority Support", included: false },
        { text: "Badge of Authenticity", included: false },
      ]
    },
    {
      name: "STANDARD VENDOR",
      price: "R499",
      period: "/ month",
      yearly: "R4,999 / year",
      recommended: true,
      features: [
        { text: "Full Profile Customization", included: true },
        { text: "Unlimited Portfolio Images", included: true },
        { text: "Priority Search Results", included: true },
        { text: "Direct Inquiries", included: true },
        { text: "Standard Analytics", included: true },
        { text: "Badge of Authenticity", included: true },
        { text: "Featured Placement", included: false },
      ]
    },
    {
      name: "FEATURED VENDOR",
      price: "R1,199",
      period: "/ month",
      yearly: "R11,999 / year",
      features: [
        { text: "Everything in Standard", included: true },
        { text: "Top-Tier Search Ranking", included: true },
        { text: "Homepage Featured Slot", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Social Media Promotion", included: true },
        { text: "Detailed Lead Insights", included: true },
        { text: "Monthly Review Analysis", included: true },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-background py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-headline mb-6">Vendor Membership Plans</h1>
          <p className="text-xl text-muted-foreground italic max-w-2xl mx-auto">
            Choose the perfect plan to grow your business and reach luxury wedding clients across South Africa.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative bg-white/50 backdrop-blur-sm p-10 rounded-3xl border ${plan.recommended ? 'border-primary border-2 scale-105 z-10' : 'border-primary/10 shadow-xl shadow-primary/5'}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-white text-xs uppercase font-bold px-6 py-2 rounded-full tracking-[0.2em] flex items-center gap-2">
                    <Star className="w-3 h-3 fill-white" />
                    Recommended
                  </Badge>
                </div>
              )}

              <div className="text-center mb-10">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-4xl font-headline">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground italic">{plan.period}</span>}
                </div>
                {plan.yearly && <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{plan.yearly}</p>}
              </div>

              <div className="space-y-6 mb-12">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground/50 line-through'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button asChild className={`w-full h-12 rounded-full font-bold tracking-widest uppercase shadow-lg ${plan.recommended ? 'bg-primary hover:bg-primary/90 shadow-primary/30' : 'bg-primary/10 text-primary hover:bg-primary/20 shadow-none'}`}>
                <Link href="/apply">APPLY AS VENDOR</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center text-sm text-muted-foreground italic">
          <p>All memberships are billed manually & securely after application approval.</p>
          <p>Prices include 15% VAT where applicable.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
