
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'HOME', href: '/' },
  { name: 'VENDORS', href: '/vendors' },
  { name: 'JOIN AS A VENDOR', href: '/membership' },
  { name: 'CONTACT', href: '/contact' },
];

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const savedVendorsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, 'users', user.uid, 'saved_vendors');
  }, [user, db]);

  const { data: savedVendors } = useCollection(savedVendorsQuery);
  const likeCount = savedVendors?.length || 0;

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';
  // Nav should be solid if open, to avoid transparency issues during drawer slide
  const shouldBeTransparent = transparent && isHome && !isScrolled && !isOpen;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to Main Content</a>
      <nav 
        role="navigation"
        aria-label="Main Navigation"
        className={cn(
          "fixed top-0 z-[100] w-full px-6 md:px-12 h-[var(--header-height)] flex items-center transition-all duration-500",
          shouldBeTransparent 
            ? "bg-transparent border-none" 
            : "bg-background/85 backdrop-blur-[12px] border-b border-border/10 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
        )}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="z-[9999]" aria-label="InFaith Journey Home">
            <Logo className={cn("w-[180px] md:w-[220px]")} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[12px] font-bold tracking-[0.2em] transition-all",
                    shouldBeTransparent 
                      ? "text-white hover:text-[#C9A96E]" 
                      : "text-[#5C3D2E] hover:text-[#C4956A]",
                    pathname === link.href && link.name === 'HOME' ? (shouldBeTransparent ? "border border-white/70 px-[14px] py-[6px] rounded-sm" : "border border-[#C4956A]/50 px-[14px] py-[6px] rounded-sm") : "",
                    pathname === link.href && link.name !== 'HOME' ? (shouldBeTransparent ? "text-white" : "text-[#C4956A]") : ""
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <Link 
                href="/my-likes" 
                className={cn(
                  "flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] transition-colors",
                  shouldBeTransparent ? "text-white hover:text-[#C9A96E]" : "text-[#5C3D2E] hover:text-[#C4956A]"
                )}
              >
                <div className="relative">
                  <Heart className={cn("w-4 h-4", (likeCount > 0 || shouldBeTransparent) ? "fill-current" : "")} />
                  {likeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#C4956A] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {likeCount}
                    </span>
                  )}
                </div>
                MY LIKES
              </Link>

              <Link 
                href="/dashboard" 
                className={cn(
                  "text-[12px] font-bold uppercase tracking-[0.2em] transition-colors",
                  shouldBeTransparent ? "text-white hover:text-[#C9A96E]" : "text-[#5C3D2E] hover:text-[#C4956A]"
                )}
              >
                DASHBOARD
              </Link>
            </div>

            <Button 
              asChild 
              className={cn(
                "rounded-full px-8 py-3 transition-all duration-300 text-[11px] font-bold tracking-[0.2em] shadow-sm",
                shouldBeTransparent 
                  ? "bg-transparent border border-[#C9A96E] text-white hover:bg-[#C9A96E] hover:text-[#2C1F0E]" 
                  : "bg-[#C4956A] text-white hover:bg-[#B38459]"
              )}
            >
              <Link href="/membership">JOIN COLLECTIVE</Link>
            </Button>
          </div>

          {/* Mobile Toggle - Ensure Visibility */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={cn(
              "lg:hidden p-2 z-[9999] transition-colors duration-300", 
              isOpen ? "text-[#5C3D2E]" : (shouldBeTransparent ? "text-white" : "text-[#5C3D2E]")
            )}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Forced Solid Opaque Background */}
      <div 
        className={cn(
          "fixed inset-0 flex flex-col items-center justify-center gap-8 transition-all duration-500 z-[9998] shadow-2xl bg-[#F8F5F0]",
          isOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        )}
        style={{ opacity: 1 }}
      >
        {NAV_LINKS.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className="text-2xl font-headline italic text-[#2C1A0E] hover:text-[#C4956A] transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/my-likes" 
          className="text-[16px] font-bold tracking-[0.2em] text-[#5C3D2E] hover:text-[#C4956A] transition-colors" 
          onClick={() => setIsOpen(false)}
        >
          MY LIKES ({likeCount})
        </Link>
        <Link 
          href="/dashboard" 
          className="text-[16px] font-bold tracking-[0.2em] text-[#5C3D2E] hover:text-[#C4956A] transition-colors" 
          onClick={() => setIsOpen(false)}
        >
          DASHBOARD
        </Link>
        <Button 
          asChild 
          className="rounded-full px-12 h-14 text-[14px] font-bold tracking-[0.2em] bg-[#C4956A] text-white hover:bg-[#B38459] shadow-lg mt-4"
        >
          <Link href="/membership" onClick={() => setIsOpen(false)}>JOIN COLLECTIVE</Link>
        </Button>
      </div>
    </>
  );
}
