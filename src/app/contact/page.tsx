import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach out to the InFaith Journey team. We\'re here to help you plan your perfect wedding.',
  openGraph: {
    title: 'Contact Us | InFaith Journey',
    description: 'Reach out to the InFaith Journey team for assistance with your wedding planning.',
    url: 'https://infaithjourney.com/contact',
    images: [
      {
        url: 'https://infaithjourney.com/og-image.jpeg',
        width: 1200,
        height: 630,
      }
    ],
    type: 'website',
    siteName: 'InFaith Journey',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | InFaith Journey',
    description: 'Reach out to the InFaith Journey team for assistance with your wedding planning.',
    images: ['https://infaithjourney.com/og-image.jpeg'],
  }
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      <main className="flex-1 section-padding px-6 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-[48px] md:text-[72px] font-headline mb-6 text-foreground">Get in Touch</h1>
            <p className="text-[18px] md:text-[22px] text-muted-foreground italic max-w-2xl mx-auto font-medium">
              We'd love to hear from you. Whether you have a question about vendors, planning, or joining our network, we're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="bg-card p-10 rounded-[32px] border border-white/5 shadow-soft space-y-10">
                <h2 className="font-headline text-[32px] mb-8 text-foreground">Contact Information</h2>
                
                <div className="space-y-8">
                  <a href="tel:0841350000" className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary border border-white/5 group-hover:bg-secondary group-hover:text-background transition-all">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Call Us</h3>
                      <p className="text-[20px] font-medium text-foreground tracking-wide">084 135 0000</p>
                    </div>
                  </a>

                  <a href="mailto:info@infaithjourney.co.za" className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary border border-white/5 group-hover:bg-secondary group-hover:text-background transition-all">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Email Us</h3>
                      <p className="text-[20px] font-medium text-foreground break-all tracking-wide">info@infaithjourney.co.za</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary border border-white/5">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Our Studio</h3>
                      <p className="text-[20px] font-medium text-foreground tracking-wide">Cape Town, South Africa</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-6">Follow Us</h3>
                  <div className="flex gap-4">
                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                      <button key={i} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-all shadow-sm">
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-12 rounded-[32px] border border-white/5 shadow-soft">
              <h2 className="font-headline text-[32px] mb-8 text-foreground">Send a Message</h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="uppercase text-[11px] tracking-[0.2em] font-bold text-secondary">Full Name</Label>
                    <Input className="h-12 rounded-xl border-white/10 bg-white/5 text-[16px] focus:ring-secondary/20" placeholder="Your Name" />
                  </div>
                  <div className="space-y-3">
                    <Label className="uppercase text-[11px] tracking-[0.2em] font-bold text-secondary">Email Address</Label>
                    <Input type="email" className="h-12 rounded-xl border-white/10 bg-white/5 text-[16px] focus:ring-secondary/20" placeholder="email@address.com" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="uppercase text-[11px] tracking-[0.2em] font-bold text-secondary">Phone Number</Label>
                  <Input className="h-12 rounded-xl border-white/10 bg-white/5 text-[16px] focus:ring-secondary/20" placeholder="012 345 6789" />
                </div>
                <div className="space-y-3">
                  <Label className="uppercase text-[11px] tracking-[0.2em] font-bold text-secondary">Your Message</Label>
                  <Textarea className="min-h-[160px] rounded-xl border-white/10 bg-white/5 text-[16px] focus:ring-secondary/20" placeholder="How can we help you?" />
                </div>
                <Button className="w-full h-14 button-rose text-[15px] font-bold tracking-widest uppercase shadow-glow">
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
