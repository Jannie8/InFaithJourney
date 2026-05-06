"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { User, Menu, X, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const NAV_LINKS = [
  { name: 'Vendors', href: '/vendors' },
  { name: 'Plans', href: '/plans' },
  { name: 'Apply', href: '/apply' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  // Ricardo the Admin check (Prototype simulation)
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

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to Main Content</a>
      <nav 
        role="navigation"
        aria-label="Main Navigation"
        className={cn(
          "fixed top-0 z-[100] w-full px-4 md:px-8 py-3 transition-all duration-300",
          scrolled 
            ? "bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity z-[110]" aria-label="InFaith Journey Home">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[13px] font-bold uppercase tracking-[0.2em] text-foreground/80 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-border mx-2" aria-hidden="true" />

            <div className="flex items-center gap-6">
              <Link 
                href="/my-likes" 
                className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-all group"
              >
                <div className="relative">
                  <Heart className={cn("w-5 h-5 group-hover:scale-110 transition-transform", likeCount > 0 ? "fill-primary text-primary" : "text-muted-foreground")} />
                  {likeCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {likeCount}
                    </span>
                  )}
                </div>
                <span className="sr-only">Saved Vendors ({likeCount})</span>
                Likes
              </Link>

              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-secondary hover:text-secondary/80 transition-all"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Admin
                </Link>
              )}

              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-all"
              >
                <User className="w-5 h-5 text-primary" />
                Portal
              </Link>

              <Button asChild className="h-10 px-6 button-rose text-[12px]">
                <Link href="/apply">JOIN AS VENDOR</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 text-foreground z-[110]"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 transition-transform duration-500 z-[105]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-2xl font-headline uppercase tracking-widest" 
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/my-likes" 
            className="text-xl font-bold uppercase flex items-center gap-2" 
            onClick={() => setIsOpen(false)}
          >
            <Heart className="w-6 h-6 text-primary fill-primary" /> My Wishlist
          </Link>
          <Button asChild className="button-rose px-12 h-14 text-lg">
            <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN AS VENDOR</Link>
          </Button>
        </div>
      </nav>
    </>
  );
}
