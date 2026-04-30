"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { User, Menu, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Vendors', href: '/vendors' },
  { name: 'Join as a Vendor', href: '/apply' },
  { name: 'Contact', href: '/contact' },
  { name: 'AI Planner', href: '/ai-planner' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full px-6 py-4 transition-all duration-500 ease-in-out",
      scrolled 
        ? "bg-background/90 backdrop-blur-2xl border-b border-primary/15 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[12.5px] font-bold text-foreground/85 hover:text-primary transition-colors uppercase tracking-[0.25em] golden-underline-glow"
            >
              {link.name === 'AI Planner' && <Sparkles className="w-3.5 h-3.5 inline-block mr-1.5 text-secondary animate-pulse" />}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-12">
          <Link href="/dashboard" className="flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors group">
            <User className="w-4.5 h-4.5 group-hover:scale-110 transition-transform text-primary/80" />
            Dashboard
          </Link>

          <Button asChild className="h-14 px-10 button-rose shadow-xl golden-glow-premium">
            <Link href="/apply">JOIN AS VENDOR</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 text-primary bg-primary/10 rounded-full transition-transform hover:scale-110">
          <Menu className="w-6.5 h-6.5" />
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background/98 backdrop-blur-3xl border-b border-primary/15 p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="text-2xl font-headline uppercase tracking-[0.2em] text-center golden-underline-glow py-2" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <hr className="border-primary/10" />
          <div className="flex flex-col gap-6 text-center">
            <Link href="/dashboard" className="font-bold text-lg tracking-widest text-foreground/80 flex items-center justify-center gap-3" onClick={() => setIsOpen(false)}>
              <User className="w-5 h-5" />
              Dashboard
            </Link>
            <Button asChild className="button-rose w-full h-16 text-lg golden-glow-premium">
              <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN NOW</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
