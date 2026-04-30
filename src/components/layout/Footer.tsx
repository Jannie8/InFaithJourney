import { Logo } from './Logo';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-primary/10 pt-32 pb-16 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-[250px] -mt-[250px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -ml-[300px] -mb-[300px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="flex flex-col gap-8">
            <Logo />
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xs font-medium italic">
              South Africa's premier wedding marketplace, connecting sophisticated couples with elite vendors for an unforgettable romantic experience.
            </p>
            <div className="flex items-center gap-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-10 border-b border-primary/10 pb-4">Quick Links</h4>
            <ul className="flex flex-col gap-5 text-[14px] font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/vendors" className="hover:text-primary transition-colors">Browse Vendors</Link></li>
              <li><Link href="/apply" className="hover:text-primary transition-colors">Vendor Registration</Link></li>
              <li><Link href="/plans" className="hover:text-primary transition-colors">Membership Plans</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-10 border-b border-primary/10 pb-4">Contact Info</h4>
            <ul className="flex flex-col gap-6 text-[15px] text-muted-foreground font-medium">
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>ricardo@infaithjourney.co.za</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Cape Town, South Africa</span>
              </li>
              <li className="flex items-start gap-4 italic">
                <span className="text-primary font-bold">☎</span>
                <span>084 135 0000</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-10 border-b border-primary/10 pb-4">Newsletter</h4>
            <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed font-medium">Join our community for romantic wedding inspiration and elite vendor highlights.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/50 border border-primary/20 rounded-full px-6 py-4 text-sm w-full outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="button-rose w-full py-4 rounded-full text-[12px] font-bold uppercase tracking-[0.2em] shadow-lg">SUBSCRIBE</button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-12 flex flex-col md:flex-row items-center justify-between text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-bold gap-6">
          <p>© {new Date().getFullYear()} InFaith Journey. Owned by Ricardo. South Africa.</p>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
