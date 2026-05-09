
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Upload, User, Briefcase, CreditCard, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Venues', 'Photography & Videography', 'Beauty', 'Flowers & Decor', 
  'Catering', 'Honeymoon Destinations', 'Music & Entertainment', 
  'Planning & Coordination', 'Fashion', 'Stationery', 'Wedding Cakes', 'Jewelry'
];

export default function ApplyPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-apply');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const steps = [
    { title: "Step 1. Create Account", desc: "Sign up and verify your email address to start your journey.", icon: User },
    { title: "Step 2. Business Details", desc: "Provide your brand name, category, and description.", icon: Briefcase },
    { title: "Step 3. Choose a Plan", desc: "Select from our membership plans that best fit your goals.", icon: CreditCard },
    { title: "Step 4. Submit Portfolio", desc: "Upload your stunning work to be reviewed by our team.", icon: ImageIcon }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="Romantic couple under floral arch"
          fill
          className={`object-cover sepia-overlay brightness-[0.7] transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          data-ai-hint="wedding couple"
          priority
        />
        {/* Soft Linear Gradient Overlay */}
        <div className="absolute inset-0 luxury-gradient-overlay opacity-85"></div>
        <div className="relative z-10 text-center px-6 pt-44 md:pt-0">
          <h1 className="text-[42px] md:text-[72px] font-headline mb-4 drop-shadow-2xl text-secondary leading-tight">Apply as a Vendor</h1>
          <p className="text-[16px] md:text-[22px] italic tracking-widest font-medium opacity-95 drop-shadow-lg text-white">Elevate your wedding business</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-[36px]">
          
          {/* Steps Sidebar */}
          <div className="lg:col-span-1 space-y-8 md:space-y-12">
            <h2 className="font-headline text-[32px] md:text-[36px] mb-6 md:mb-8 text-secondary text-center lg:text-left">How It Works</h2>
            <div className="space-y-8 md:space-y-10 relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-primary/20"></div>
              {steps.map((step, i) => (
                <div key={i} className="relative pl-16 md:pl-20 group">
                  <div className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 bg-white/40 backdrop-blur-md rounded-full border border-primary/20 flex items-center justify-center z-10 shadow-md golden-glow-hover shrink-0">
                    <step.icon className="w-5 md:w-7 h-5 md:h-5 text-primary" />
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-headline font-semibold mb-1 md:mb-2 text-primary">{step.title}</h3>
                  <p className="text-[14px] md:text-[16px] text-muted-foreground leading-relaxed font-medium opacity-90 italic">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2 p-6 md:p-16 rounded-[24px] border border-primary/10 shadow-lg space-y-8 md:space-y-12 bg-white/40 backdrop-blur-sm">
            <h2 className="font-headline text-[28px] md:text-[36px] mb-6 md:mb-10 border-b border-primary/10 pb-6 text-secondary text-center md:text-left">Vendor Application</h2>
            
            <form className="space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <Label className="uppercase text-[11px] md:text-[13px] tracking-widest font-bold text-foreground/70">How did you hear about us?</Label>
                  <Select>
                    <SelectTrigger className="h-12 md:h-14 rounded-xl px-6 border-primary/20 bg-background/50 text-[15px] md:text-[16px]">
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="friend">Word of Mouth</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <h3 className="text-[12px] md:text-[15px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <Label className="uppercase text-[11px] md:text-[13px] tracking-widest font-bold text-foreground/70">Full Name</Label>
                    <Input className="h-12 md:h-14 rounded-xl px-6 border-primary/20 bg-background/50 text-[15px] md:text-[16px]" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="uppercase text-[11px] md:text-[13px] tracking-widest font-bold text-foreground/70">Email Address</Label>
                    <Input type="email" className="h-12 md:h-14 rounded-xl px-6 border-primary/20 bg-background/50 text-[15px] md:text-[16px]" placeholder="john@example.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <h3 className="text-[12px] md:text-[15px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <Label className="uppercase text-[11px] md:text-[13px] tracking-widest font-bold text-foreground/70">Primary Category</Label>
                    <Select>
                      <SelectTrigger className="h-12 md:h-14 rounded-xl px-6 border-primary/20 bg-background/50 text-[15px] md:text-[16px]">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label className="uppercase text-[11px] md:text-[13px] tracking-widest font-bold text-foreground/70">Business Name</Label>
                    <Input className="h-12 md:h-14 rounded-xl px-6 border-primary/20 bg-background/50 text-[15px] md:text-[16px]" placeholder="Your Luxury Brand" />
                  </div>
                  <div className="space-y-2 md:space-y-3 md:col-span-2">
                    <Label className="uppercase text-[11px] md:text-[13px] tracking-widest font-bold text-foreground/70">Short Description</Label>
                    <Textarea className="min-h-[100px] md:min-h-[140px] rounded-xl px-6 py-4 border-primary/20 bg-background/50 text-[15px] md:text-[16px]" placeholder="Tell us about your services..." />
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <h3 className="text-[12px] md:text-[15px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2">Portfolio Upload</h3>
                <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 md:p-12 text-center bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer golden-glow-hover">
                  <Upload className="w-8 md:w-10 h-8 md:h-10 text-primary mx-auto mb-3 md:mb-4" />
                  <p className="text-[16px] md:text-[18px] font-headline mb-1 md:mb-2 text-primary">Or click to upload</p>
                  <p className="text-[11px] md:text-[13px] text-muted-foreground uppercase tracking-widest font-bold">(JPG, PNG max 5MB)</p>
                </div>
              </div>

              <div className="pt-6 md:pt-8 text-center space-y-6">
                <div className="flex justify-center">
                  <Button className="w-full md:w-auto px-12 md:px-20 h-14 md:h-16 button-rose text-[14px] md:text-[16px]">
                    SUBMIT APPLICATION
                  </Button>
                </div>
                <p className="text-[13px] md:text-[14px] text-muted-foreground italic font-medium opacity-80">
                  *Billed manually & securely after application approval.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
