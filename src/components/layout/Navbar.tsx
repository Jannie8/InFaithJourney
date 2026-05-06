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
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className={cn(
          "fixed top-0 z-[100] w-full px-6 md:px-12 py-4 transition-all duration-500",
          scrolled 
            ? "bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="z-[110] outline-offset-8" aria-label="InFaith Journey Home">
            <Logo />
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
                    "text-[13px] font-bold uppercase tracking-[0.15em] transition-colors",
                    scrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-white",
                    pathname === link.href && "text-primary font-extrabold"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className={cn("h-6 w-[1px] mx-2", scrolled ? "bg-primary/20" : "bg-white/20")} aria-hidden="true" />

            <div className="flex items-center gap-6">
              <Link 
                href="/my-likes" 
                className={cn(
                  "flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] transition-all group",
                  scrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-white"
                )}
              >
                <div className="relative">
                  <Heart className={cn("w-5 h-5 transition-transform group-hover:scale-110", likeCount > 0 ? "fill-primary text-primary" : scrolled ? "text-primary/70" : "text-white/70")} />
                  {likeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                      {likeCount}
                    </span>
                  )}
                </div>
                Likes
              </Link>

              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-secondary hover:opacity-80 transition-all"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Admin
                </Link>
              )}

              <Link 
                href="/dashboard" 
                className={cn(
                  "flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] transition-all",
                  scrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-white"
                )}
              >
                <User className="w-5 h-5 text-primary" />
                Portal
              </Link>

              <Button asChild className="h-10 px-8 button-rose text-[12px] font-bold tracking-widest shadow-md">
                <Link href="/apply">JOIN AS VENDOR</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={cn(
              "lg:hidden p-2 z-[110] rounded-full transition-colors",
              scrolled ? "text-foreground hover:bg-primary/5" : "text-white hover:bg-white/10"
            )}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu (Drawer) */}
        <div className={cn(
          "fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 transition-all duration-500 z-[105]",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}>
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-3xl font-headline text-foreground hover:text-primary transition-colors" 
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-[1px] w-12 bg-primary/20 my-2" />
          <Link 
            href="/my-likes" 
            className="text-lg font-bold uppercase tracking-widest flex items-center gap-3 text-foreground/80" 
            onClick={() => setIsOpen(false)}
          >
            <Heart className="w-6 h-6 text-primary fill-primary" /> My Wishlist ({likeCount})
          </Link>
          <Link 
            href="/dashboard" 
            className="text-lg font-bold uppercase tracking-widest flex items-center gap-3 text-foreground/80" 
            onClick={() => setIsOpen(false)}
          >
            <User className="w-6 h-6 text-primary" /> Vendor Portal
          </Link>
          <Button asChild className="button-rose px-16 h-14 text-lg mt-4">
            <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN AS VENDOR</Link>
          </Button>
        </div>
      </nav>
    </>
  );
}
