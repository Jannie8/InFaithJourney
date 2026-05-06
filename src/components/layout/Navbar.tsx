
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { User, Menu, X, Sparkles, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const NAV_LINKS = [
  { name: 'Vendors', href: '/vendors' },
  { name: 'Plans', href: '/plans' },
  { name: 'Join as a Vendor', href: '/apply' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  const savedVendorsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, 'users', user.uid, 'saved_vendors');
  }, [user, db]);

  const { data: savedVendors } = useCollection(savedVendorsQuery);
  const likeCount = savedVendors?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 z-[100] w-full px-4 md:px-8 py-3 md:py-4 transition-all duration-500 ease-in-out",
      scrolled 
        ? "bg-background border-b border-primary/20 shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity z-[110]">
          <Logo />
        </Link>

        {/* Center Links (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[13px] font-bold uppercase tracking-[0.2em] golden-underline-glow transition-colors",
                scrolled ? "text-foreground" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/ai-planner"
            className={cn(
              "text-[13px] font-bold uppercase tracking-[0.2em] golden-underline-glow flex items-center gap-1.5 transition-colors",
              scrolled ? "text-foreground" : "text-white"
            )}
          >
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            AI Assistant
          </Link>
        </div>

        {/* Right Actions (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-8">
          <Link 
            href="/my-likes" 
            className={cn(
              "flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] transition-colors group relative",
              scrolled ? "text-foreground" : "text-white"
            )}
          >
            <div className="relative">
              <Heart className={cn("w-5 h-5 group-hover:scale-110 transition-transform text-primary", likeCount > 0 && "fill-current")} />
              {likeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md animate-in zoom-in">
                  {likeCount}
                </span>
              )}
            </div>
            My Likes
          </Link>

          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] transition-colors group",
              scrolled ? "text-foreground" : "text-white"
            )}
          >
            <User className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
            Dashboard
          </Link>

          <Button asChild className="h-12 px-8 button-rose text-[13px] shadow-lg golden-glow-premium">
            <Link href="/apply">JOIN AS VENDOR</Link>
          </Button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link 
            href="/my-likes" 
            className={cn(
              "p-2.5 rounded-full relative",
              scrolled ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
            )}
          >
            <Heart className={cn("w-6 h-6", likeCount > 0 && "fill-current")} />
            {likeCount > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {likeCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={cn(
              "p-2.5 rounded-full transition-all z-[110]",
              scrolled ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-background lg:hidden flex flex-col items-center justify-center gap-8 transition-all duration-500 z-[105]",
        isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col gap-8 w-full px-12 text-center">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-2xl font-headline uppercase tracking-[0.15em] hover:text-primary transition-colors py-2 border-b border-primary/5" 
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/ai-planner" 
            className="text-2xl font-headline uppercase tracking-[0.15em] hover:text-primary transition-colors py-2 border-b border-primary/5 flex items-center justify-center gap-3" 
            onClick={() => setIsOpen(false)}
          >
            <Sparkles className="w-6 h-6 text-secondary" />
            AI Assistant
          </Link>
          <Link 
            href="/my-likes" 
            className="text-xl font-bold uppercase tracking-[0.2em] text-foreground/80 flex items-center justify-center gap-3 pt-4" 
            onClick={() => setIsOpen(false)}
          >
            <Heart className={cn("w-6 h-6 text-primary", likeCount > 0 && "fill-current")} />
            My Likes {likeCount > 0 && `(${likeCount})`}
          </Link>
          <Link 
            href="/dashboard" 
            className="text-xl font-bold uppercase tracking-[0.2em] text-foreground/80 flex items-center justify-center gap-3" 
            onClick={() => setIsOpen(false)}
          >
            <User className="w-6 h-6 text-primary" />
            Dashboard
          </Link>
          <Button asChild className="button-rose w-full h-16 text-lg mt-4 shadow-xl golden-glow-premium">
            <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN AS VENDOR</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
