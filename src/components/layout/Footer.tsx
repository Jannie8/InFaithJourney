import { Logo } from './Logo';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-primary/10 pt-32 pb-16 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-[250px] -mt-[250px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -ml-[300px] -mb-[300px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Golden Divider Line */}
        <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent mb-24 shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="flex flex-col gap-8">
            <Logo />
            <p className="text-muted-foreground text-[15.5px] leading-relaxed max-w-xs font-medium italic opacity-90">
              South Africa's premier wedding marketplace, connecting sophisticated couples with elite vendors for an unforgettable romantic experience.
            </p>
            <div className="flex items-center gap-6">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-md golden-glow-premium group">
                  <social.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-10 border-b border-primary/10 pb-4">Quick Links</h4>
            <ul className="flex flex-col gap-5 text-[14px] font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors golden-underline-glow inline-block">Home</Link></li>
              <li><Link href="/vendors" className="hover:text-primary transition-colors golden-underline-glow inline-block">Browse Vendors</Link></li>
              <li><Link href="/apply" className="hover:text-primary transition-colors golden-underline-glow inline-block">Vendor Registration</Link></li>
              <li><Link href="/plans" className="hover:text-primary transition-colors golden-underline-glow inline-block">Membership Plans</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors golden-underline-glow inline-block">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-10 border-b border-primary/10 pb-4">Contact Info</h4>
            <ul className="flex flex-col gap-6 text-[15.5px] text-muted-foreground font-medium">
              <li className="flex items-start gap-4 hover:text-primary transition-colors group cursor-pointer">
                <Mail className="w-5.5 h-5.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span>info@infaithjourney.co.za</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5.5 h-5.5 text-primary shrink-0" />
                <span>Cape Town, South Africa</span>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5.5 h-5.5 text-primary shrink-0" />
                <a href="tel:0841350000" className="hover:text-primary transition-colors font-bold tracking-wider">084 135 0000</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-10 border-b border-primary/10 pb-4">Newsletter</h4>
            <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed font-medium">Join our community for romantic wedding inspiration and elite vendor highlights.</p>
            <div className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/50 border border-primary/20 rounded-full px-8 py-4.5 text-sm w-full outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              />
              <button className="button-rose w-full py-5 rounded-full text-[13px] font-bold uppercase tracking-[0.2em] shadow-lg golden-glow-premium">SUBSCRIBE</button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-12 flex flex-col md:flex-row items-center justify-between text-[11px] text-muted-foreground uppercase tracking-[0.35em] font-bold gap-8">
          <p>© 2026 InFaith Journey – Curated Luxury Weddings. Owned by Ricardo. South Africa.</p>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
