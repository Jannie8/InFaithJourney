"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Phone, User, Menu } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Join as a Vendor', href: '/apply' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-primary/10 px-6 py-6 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-14">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors uppercase tracking-[0.25em] relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all duration-500 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-12">
          <a href="tel:0841350000" className="flex items-center gap-3 text-[14px] font-bold text-foreground/80 hover:text-primary transition-all group">
            <Phone className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            <span className="tracking-widest">084 135 0000</span>
          </a>
          
          <Link href="/dashboard" className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors group">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>

          <Button asChild className="h-14 px-10 button-rose shadow-xl">
            <Link href="/apply">JOIN AS VENDOR</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 text-primary bg-primary/5 rounded-full">
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background/98 backdrop-blur-2xl border-b border-primary/10 p-12 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="text-2xl font-headline uppercase tracking-[0.2em] text-center" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <hr className="border-primary/10" />
          <div className="flex flex-col gap-6 text-center">
            <a href="tel:0841350000" className="font-bold text-xl tracking-widest text-primary flex items-center justify-center gap-3">
              <Phone className="w-6 h-6" />
              084 135 0000
            </a>
            <Button asChild className="button-rose w-full h-16 text-lg">
              <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN NOW</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
