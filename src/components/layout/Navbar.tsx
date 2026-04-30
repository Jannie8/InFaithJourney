"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { User, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Vendors', href: '/vendors' },
  { name: 'Join as a Vendor', href: '/apply' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 z-[100] w-full px-4 md:px-8 py-3 md:py-4 transition-all duration-500 ease-in-out",
      scrolled 
        ? "bg-background/95 backdrop-blur-2xl border-b border-primary/15 shadow-md" 
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
              className="text-[13px] font-bold text-foreground/90 hover:text-primary transition-colors uppercase tracking-[0.2em] golden-underline-glow"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/vendors"
            className="text-[13px] font-bold text-foreground/90 hover:text-primary transition-colors uppercase tracking-[0.2em] golden-underline-glow flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            AI Planner
          </Link>
        </div>

        {/* Right Actions (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] hover:text-primary transition-colors group">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform text-primary/80" />
            Dashboard
          </Link>

          <Button asChild className="h-12 px-8 button-rose text-[13px] golden-glow-premium">
            <Link href="/apply">JOIN AS VENDOR</Link>
          </Button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden p-2.5 text-primary bg-primary/10 rounded-full transition-all z-[110]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-background/98 backdrop-blur-3xl lg:hidden flex flex-col items-center justify-center gap-8 transition-all duration-500 z-[105]",
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
            href="/dashboard" 
            className="text-xl font-bold uppercase tracking-[0.2em] text-foreground/80 flex items-center justify-center gap-3 pt-4" 
            onClick={() => setIsOpen(false)}
          >
            <User className="w-6 h-6" />
            Dashboard
          </Link>
          <Button asChild className="button-rose w-full h-16 text-lg mt-4 golden-glow-premium">
            <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN AS VENDOR</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
