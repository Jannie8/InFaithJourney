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
      badgeText: "Recommended",
      badgeIcon: Star,
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
      badgeText: "Most Visibility",
      badgeIcon: Star,
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
      
      <main className="flex-1 bg-background py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-headline mb-8">Vendor Membership Plans</h1>
          <p className="text-xl text-muted-foreground italic max-w-2xl mx-auto tracking-wide">
            Choose the perfect plan to grow your business and reach luxury wedding clients across South Africa.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative luxury-card p-12 md:p-14 ${plan.recommended ? 'border-primary border-2 shadow-2xl shadow-primary/10' : ''}`}
            >
              {plan.badgeText && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-white text-[10px] uppercase font-bold px-6 py-2.5 rounded-full tracking-[0.3em] flex items-center gap-2 border-none shadow-xl">
                    {plan.badgeIcon && <plan.badgeIcon className="w-3.5 h-3.5 fill-white" />}
                    {plan.badgeText}
                  </Badge>
                </div>
              )}

              <div className="text-center mb-12">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary mb-6">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-5xl font-headline">{plan.price}</span>
                  {plan.period && <span className="text-lg text-muted-foreground italic font-medium">{plan.period}</span>}
                </div>
                {plan.yearly && <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60 mt-2">{plan.yearly}</p>}
              </div>

              <div className="space-y-6 mb-16">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-4">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-[15px] font-medium leading-tight ${feature.included ? 'text-foreground' : 'text-muted-foreground/50 line-through'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button asChild className={`w-full h-16 rounded-full font-bold tracking-[0.2em] uppercase text-[12px] transition-all duration-300 ${plan.recommended ? 'button-rose' : 'bg-primary/10 text-primary hover:bg-primary/20 shadow-none'}`}>
                <Link href="/apply">APPLY AS VENDOR</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center text-[13px] text-muted-foreground italic font-medium space-y-2">
          <p>All memberships are billed manually & securely after application approval.</p>
          <p>Prices include 15% VAT where applicable.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
