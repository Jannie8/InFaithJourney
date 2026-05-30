
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-24 px-6 pt-56 md:pt-[120px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-[36px] md:text-[54px] font-headline mb-4 text-foreground">Get in Touch</h1>
            <p className="text-[16px] md:text-[20px] text-muted-foreground italic max-w-2xl mx-auto font-medium">
              We'd love to hear from you. Whether you have a question about vendors or joining our network, we're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="bg-card p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-border shadow-soft space-y-8 md:space-y-10">
                <h2 className="font-headline text-[28px] md:text-[32px] mb-6 text-foreground">Contact Information</h2>
                
                <div className="space-y-6 md:space-y-8">
                  <a href="tel:+27784420278" className="flex items-start gap-4 md:gap-6 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
                      <Phone className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Call Us</h3>
                      <p className="text-[16px] md:text-[18px] font-semibold text-foreground tracking-wide">+27 78 442 0278</p>
                    </div>
                  </a>

                  <a href="mailto:admin@infaithjourney.com" className="flex items-start gap-4 md:gap-6 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
                      <Mail className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Email Us</h3>
                      <p className="text-[16px] md:text-[18px] font-semibold text-foreground break-all tracking-wide">admin@infaithjourney.com</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-muted flex items-center justify-center text-primary shadow-inner shrink-0">
                      <MapPin className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Our Studio</h3>
                      <p className="text-[16px] md:text-[18px] font-semibold text-foreground tracking-wide">Cape Town, South Africa</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-border">
                  <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Follow Our Journey</h3>
                  <div className="flex gap-4">
                    {[
                      { Icon: Instagram, href: "https://www.instagram.com/infaith_journey?igsh=cm04dWswbTBraWdl" },
                      { Icon: Facebook, href: "https://www.facebook.com/share/1DeLWDtkAg/" },
                      { Icon: Twitter, href: "https://x.com/InFaithJourney" }
                    ].map((social, i) => (
                      <Link 
                        key={i} 
                        href={social.href} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <social.Icon className="w-4.5 md:w-5 h-4.5 md:h-5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 md:p-12 rounded-[24px] md:rounded-[32px] border border-border shadow-soft">
              <h2 className="font-headline text-[28px] md:text-[32px] mb-8 text-foreground">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] md:text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Full Name</Label>
                    <Input className="h-12 rounded-xl border-border bg-background text-[15px]" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] md:text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Email Address</Label>
                    <Input type="email" className="h-12 rounded-xl border-border bg-background text-[15px]" placeholder="email@address.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Phone Number</Label>
                  <Input className="h-12 rounded-xl border-border bg-background text-[15px]" placeholder="012 345 6789" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] md:text-[11px] tracking-[0.1em] font-bold text-muted-foreground">Your Message</Label>
                  <Textarea className="min-h-[140px] md:min-h-[160px] rounded-xl border-border bg-background text-[15px]" placeholder="How can we help you?" />
                </div>
                <Button className="w-full h-12 md:h-14 button-rose text-[13px] md:text-[14px] font-bold tracking-widest uppercase shadow-md">
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
