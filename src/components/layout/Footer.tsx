
import { Logo } from './Logo';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-primary/10 pt-20 pb-10 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              InFaith Journey is South Africa's premier wedding marketplace, connecting sophisticated couples with elite vendors for an unforgettable romantic experience.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/vendors" className="hover:text-primary transition-colors">Browse Vendors</Link></li>
              <li><Link href="/venues" className="hover:text-primary transition-colors">Wedding Venues</Link></li>
              <li><Link href="/apply" className="hover:text-primary transition-colors">Vendor Registration</Link></li>
              <li><Link href="/plans" className="hover:text-primary transition-colors">Membership Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>ricardo@infaithjourney.co.za</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Cape Town, South Africa</span>
              </li>
              <li className="flex items-center gap-3">
                <span>084 135 0000</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Join our community for romantic wedding inspiration and exclusive vendor offers.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-primary/5 border-primary/20 rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary outline-none"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">JOIN</button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} InFaith Journey. Owned by Ricardo. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
