
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Home, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen watercolor-bg">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 pt-32 md:pt-44 pb-24 md:pb-32">
        <div className="max-w-2xl w-full text-center space-y-8 md:space-y-12">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-24 h-24 md:w-32 md:h-32 mx-auto"
          >
            <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping"></div>
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl border border-secondary/20">
              <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-secondary" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -top-3 md:-top-4 -right-3 md:-right-4"
            >
              <Sparkles className="w-6 md:w-8 h-6 md:h-8 text-secondary/40" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 md:space-y-6"
          >
            <h1 className="font-headline text-[32px] md:text-[62px] leading-tight italic">Application Received</h1>
            <p className="text-[16px] md:text-[20px] text-muted-foreground italic font-medium leading-relaxed max-w-xl mx-auto px-4">
              Your artistry deserves to be celebrated. Ricardo and the InFaith Journey team will review your application and reach out within 48 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-8"
          >
            <Button asChild variant="outline" className="w-full sm:w-auto px-8 md:px-10 h-12 md:h-14 rounded-full border-primary/20 text-primary font-bold tracking-widest uppercase text-[11px] md:text-[12px] golden-glow-premium">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" /> RETURN HOME
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto px-8 md:px-10 h-12 md:h-14 button-rose font-bold tracking-widest uppercase text-[11px] md:text-[12px] shadow-xl">
              <Link href="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" /> VENDOR PORTAL
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
