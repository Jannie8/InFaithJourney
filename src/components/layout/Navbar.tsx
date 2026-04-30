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
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-lg border-b border-primary/10 px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-semibold hover:text-primary transition-colors uppercase tracking-[0.15em]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-2 text-[14px] font-bold text-foreground/80">
            <span className="text-primary">☎</span>
            <span>084 135 0000</span>
          </div>
          
          <Link href="/dashboard" className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <User className="w-4 h-4" />
            Dashboard
          </Link>

          <Button asChild className="rounded-full px-8 py-6 button-rose text-[12px] font-bold uppercase tracking-[0.2em]">
            <Link href="/apply">JOIN AS VENDOR</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-primary">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="text-lg font-headline uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <hr className="border-primary/10" />
          <div className="flex flex-col gap-4">
            <div className="font-bold">☎ 084 135 0000</div>
            <Button asChild className="button-rose w-full py-6">
              <Link href="/apply" onClick={() => setIsOpen(false)}>JOIN NOW</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
