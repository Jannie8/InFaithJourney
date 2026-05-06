"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen watercolor-bg pt-[64px]">
      <Navbar />
      
      <main className="flex-1 section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-[42px] md:text-[54px] font-headline mb-4 text-foreground">Get in Touch</h1>
            <p className="text-[17px] md:text-[20px] text-muted-foreground italic max-w-2xl mx-auto font-medium">
              We'd love to hear from you. Whether you have a question about vendors or joining our network, we're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="bg-card p-10 rounded-[32px] border border-border shadow-soft space-y-10">
                <h2 className="font-headline text-[32px] mb-8 text-foreground">Contact Information</h2>
                
                <div className="space-y-8">
                  <a href="tel:0841350000" className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Call Us</h3>
                      <p className="text-[18px] font-semibold text-foreground tracking-wide">084 135 0000</p>
                    </div>
                  </a>

                  <a href="mailto:info@infaithjourney.co.za" className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Email Us</h3>
                      <p className="text-[18px] font-semibold text-foreground break-all tracking-wide">info@infaithjourney.co.za</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary shadow-inner">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Our Studio</h3>
                      <p className="text-[18px] font-semibold text-foreground tracking-wide">Cape Town, South Africa</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Follow Our Journey</h3>
                  <div className="flex gap-4">
                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                      <button key={i} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-12 rounded-[32px] border border-border shadow-soft">
              <h2 className="font-headline text-[32px] mb-8 text-foreground">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Full Name</Label>
                    <Input className="h-12 rounded-xl border-border bg-background text-[15px]" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Email Address</Label>
                    <Input type="email" className="h-12 rounded-xl border-border bg-background text-[15px]" placeholder="email@address.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Phone Number</Label>
                  <Input className="h-12 rounded-xl border-border bg-background text-[15px]" placeholder="012 345 6789" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Your Message</Label>
                  <Textarea className="min-h-[160px] rounded-xl border-border bg-background text-[15px]" placeholder="How can we help you?" />
                </div>
                <Button className="w-full h-14 button-rose text-[14px] font-bold tracking-widest uppercase shadow-md">
                  SEND MESSAGE
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
