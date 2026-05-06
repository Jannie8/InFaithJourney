"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { User, Menu, X, Heart, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Vendors', href: '/vendors' },
  { name: 'Plans', href: '/plans' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const pathname = usePathname();

  const isAdmin = user?.email === 'ricardo@infaithjourney.com';

  const savedVendorsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, 'users', user.uid, 'saved_vendors');
  }, [user, db]);

  const { data: savedVendors } = useCollection(savedVendorsQuery);
  const likeCount = savedVendors?.length || 0;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to Main Content</a>
      <nav 
        role="navigation"
        aria-label="Main Navigation"
        className="sticky top-0 z-[100] w-full px-6 md:px-12 h-16 md:h-20 bg-background/80 backdrop-blur-sm border-b border-primary/5 transition-all duration-300 flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="z-[110] outline-offset-8" aria-label="InFaith Journey Home">
            <Logo className="w-[140px] md:w-[160px]" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8 mr-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "text-[12px] font-bold uppercase tracking-[0.15em] transition-colors text-foreground/70 hover:text-primary",
                    pathname === link.href && "text-primary font-extrabold"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="h-4 w-[1px] mx-2 bg-primary/10" aria-hidden="true" />

            <div className="flex items-center gap-6">
              <Link 
                href="/my-likes" 
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] transition-all group text-foreground/70 hover:text-primary"
              >
                <div className="relative">
                  <Heart className={cn("w-4 h-4 transition-transform group-hover:scale-110", likeCount > 0 ? "fill-primary text-primary" : "text-primary/70")} />
                  {likeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                      {likeCount}
                    </span>
                  )}
                </div>
                Likes
              </Link>

              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-secondary hover:opacity-80 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Link>
              )}

              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] transition-all text-foreground/70 hover:text-primary"
              >
                <User className="w-4 h-4 text-primary" />
                Portal
              </Link>

              <Button asChild className="h-9 px-6 button-rose text-[11px] font-bold tracking-widest shadow-sm">
                <Link href="/apply">JOIN AS VENDOR</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 z-[110] rounded-full transition-colors text-foreground hover:bg-primary/5"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 transition-all duration-500 z-[105]",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}>
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-2xl font-headline text-foreground hover:text-primary transition-colors" 
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-[1px] w-12 bg-primary/20 my-2" />
          <Link 
            href="/my-likes" 
            className="text-[16px] font-bold uppercase tracking-widest flex items-center gap-3 text-foreground/80" 
            onClick={() => setIsOpen(false)}
          >
            <Heart className="w-5 h-5 text-primary fill-primary" /> My Wishlist ({likeCount})
          </Link>
          <Link 
            href="/dashboard" 
            className="text-[16px] font-bold uppercase tracking-widest flex items-center gap-3 text-foreground/80" 
            onClick={() => setIsOpen(false)}
          >
            <User className="w-5 h-5 text-primary" /> Vendor Portal
          </Link>
          <Button asChild className="button-rose px-12 h-12 text-[14px] mt-4">
            <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN AS VENDOR</Link>
          </Button>
        </div>
      </nav>
    </>
  );
}
