
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | InFaith Journey',
  description: 'Have a question or need assistance? Reach out to the InFaith Journey team. We\'re here to help you plan your perfect wedding.',
  openGraph: {
    title: 'Contact Us | InFaith Journey',
    description: 'Reach out to the InFaith Journey team for assistance with your wedding planning.',
    url: 'https://infaithjourney.com/contact',
    images: ['https://infaithjourney.com/og-image.jpeg'],
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
      
      <main className="flex-1 section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-[55px] md:text-[72px] font-headline mb-6">Get in Touch</h1>
            <p className="text-[18px] md:text-[22px] text-muted-foreground italic max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about vendors, planning, or joining our network, we're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="bg-white p-10 rounded-[20px] border border-primary/10 shadow-lg space-y-10">
                <h2 className="font-headline text-[32px] mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <a href="tel:0841350000" className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold uppercase tracking-widest text-primary mb-1">Call Us</h3>
                      <p className="text-[20px] font-medium text-foreground">084 135 0000</p>
                    </div>
                  </a>

                  <a href="mailto:info@infaithjourney.co.za" className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold uppercase tracking-widest text-primary mb-1">Email Us</h3>
                      <p className="text-[20px] font-medium text-foreground">info@infaithjourney.co.za</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold uppercase tracking-widest text-primary mb-1">Our Studio</h3>
                      <p className="text-[20px] font-medium text-foreground">Cape Town, South Africa</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-primary/10">
                  <h3 className="text-[14px] font-bold uppercase tracking-widest text-primary mb-6">Follow Us</h3>
                  <div className="flex gap-4">
                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                      <button key={i} className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-12 rounded-[20px] border border-primary/10 shadow-lg">
              <h2 className="font-headline text-[32px] mb-8">Send a Message</h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Full Name</Label>
                    <Input className="h-12 rounded-xl border-primary/10 text-[16px]" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Email Address</Label>
                    <Input type="email" className="h-12 rounded-xl border-primary/10 text-[16px]" placeholder="email@address.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Phone Number</Label>
                  <Input className="h-12 rounded-xl border-primary/10 text-[16px]" placeholder="012 345 6789" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[12px] tracking-widest font-bold text-foreground/70">Your Message</Label>
                  <Textarea className="min-h-[160px] rounded-xl border-primary/10 text-[16px]" placeholder="How can we help you?" />
                </div>
                <Button className="w-full h-14 button-rose text-[15px] font-semibold">
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
