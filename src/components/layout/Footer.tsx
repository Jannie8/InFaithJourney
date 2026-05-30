import { Logo } from './Logo';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#FAF6EF] border-t border-primary/10 pt-20 md:pt-32 pb-12 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] -mr-[200px] -mt-[200px]"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-secondary/5 rounded-full blur-[100px] -ml-[200px] -mb-[200px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Golden Divider Line */}
        <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent mb-16 md:mb-24 shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20 mb-16 md:mb-24">
          <div className="flex flex-col gap-6 md:gap-8">
            <Logo />
            <p className="text-muted-foreground text-[15.5px] leading-relaxed max-w-xs font-medium italic opacity-90">
              South Africa&apos;s premier wedding marketplace, connecting sophisticated couples with elite vendors for an unforgettable romantic experience.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              {[
                { icon: Facebook, href: "https://www.facebook.com/share/1DeLWDtkAg/" },
                { icon: Instagram, href: "https://www.instagram.com/infaith_journey?igsh=cm04dWswbTBraWdl" },
                { icon: Twitter, href: "https://x.com/InFaithJourney" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm golden-glow-premium group"
                >
                  <social.icon className="w-5.5 h-5.5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-8 md:mb-10 border-b border-primary/10 pb-4">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-[13px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <li><Link href="/vendors" className="hover:text-primary transition-colors golden-underline-glow inline-block">Browse Vendors</Link></li>
              <li><Link href="/apply" className="hover:text-primary transition-colors golden-underline-glow inline-block">Join as Vendor</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors golden-underline-glow inline-block">Contact Us</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors golden-underline-glow inline-block">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-8 md:mb-10 border-b border-primary/10 pb-4">Contact Info</h4>
            <ul className="flex flex-col gap-5 md:gap-6 text-[15.5px] text-muted-foreground font-medium">
              <li className="flex items-start gap-4 hover:text-primary transition-colors group cursor-pointer">
                <Mail className="w-5.5 h-5.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="break-all">admin@infaithjourney.com</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5.5 h-5.5 text-primary shrink-0" />
                <span>Cape Town, South Africa</span>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5.5 h-5.5 text-primary shrink-0" />
                <a href="tel:+27784420278" className="hover:text-primary transition-colors font-bold tracking-wider">+27 78 442 0278</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-2xl mb-8 md:mb-10 border-b border-primary/10 pb-4">Newsletter</h4>
            <p className="text-[15px] text-muted-foreground mb-6 md:mb-8 leading-relaxed font-medium">Join our community for romantic wedding inspiration and elite highlights.</p>
            <div className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/50 border border-primary/20 rounded-full px-6 py-4 text-sm w-full outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
              />
              <button className="button-rose w-full py-4.5 rounded-full text-[12px] font-bold uppercase tracking-[0.2em] shadow-lg golden-glow-premium">SUBSCRIBE</button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-10 flex flex-col md:flex-row items-center justify-between text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-bold gap-6 text-center md:text-left">
          <p>© 2026 InFaith Journey – Curated Luxury Weddings. Owned by Ricardo. South Africa.</p>
          <div className="flex gap-8 md:gap-12">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
