
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
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <span>084 135 0000</span>
          </div>
          
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <User className="w-4 h-4" />
            Dashboard
          </Link>

          <Button asChild className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link href="/apply">JOIN AS VENDOR</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-primary">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Placeholder - In production this would be a proper drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="text-lg font-medium">
              {link.name}
            </Link>
          ))}
          <hr className="border-primary/10" />
          <div className="flex items-center justify-between py-2">
            <span>084 135 0000</span>
            <Button asChild size="sm" className="bg-primary">
              <Link href="/apply">JOIN NOW</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
