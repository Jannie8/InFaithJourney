"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Phone, User, Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Join as a Vendor', href: '/apply' },
  { name: 'Contact', href: '/contact' },
  { name: 'AI Assistant', href: '/ai-assistant' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-primary/10 px-6 py-4 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[12px] font-bold text-foreground/80 hover:text-primary transition-colors uppercase tracking-[0.25em] golden-underline-hover"
            >
              {link.name === 'AI Assistant' && <Sparkles className="w-3 h-3 inline-block mr-1 text-secondary" />}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-10">
          <a href="tel:0841350000" className="flex items-center gap-2 text-[13px] font-bold text-foreground/80 hover:text-primary transition-all group">
            <Phone className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
            <span className="tracking-widest">084 135 0000</span>
          </a>
          
          <Link href="/dashboard" className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors group">
            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>

          <Button asChild className="h-12 px-8 button-rose shadow-xl golden-glow-hover">
            <Link href="/apply">JOIN AS VENDOR</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-primary bg-primary/5 rounded-full">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background/98 backdrop-blur-2xl border-b border-primary/10 p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="text-xl font-headline uppercase tracking-[0.2em] text-center" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <hr className="border-primary/10" />
          <div className="flex flex-col gap-4 text-center">
            <a href="tel:0841350000" className="font-bold text-lg tracking-widest text-primary flex items-center justify-center gap-3">
              <Phone className="w-5 h-5" />
              084 135 0000
            </a>
            <Button asChild className="button-rose w-full h-14 text-lg golden-glow-hover">
              <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN NOW</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
