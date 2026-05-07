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
      
      <main className="flex-1 flex items-center justify-center p-6 pt-44 pb-32">
        <div className="max-w-2xl w-full text-center space-y-12">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-32 h-32 mx-auto"
          >
            <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping"></div>
            <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border border-secondary/20">
              <CheckCircle className="w-16 h-16 text-secondary" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-secondary/40" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h1 className="font-headline text-[48px] md:text-[62px] leading-tight italic">Application Received</h1>
            <p className="text-[18px] md:text-[20px] text-muted-foreground italic font-medium leading-relaxed max-w-xl mx-auto">
              Your artistry deserves to be celebrated. Ricardo and the InFaith Journey team will review your application and reach out within 48 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Button asChild variant="outline" className="w-full sm:w-auto px-10 h-14 rounded-full border-primary/20 text-primary font-bold tracking-widest uppercase text-[12px] golden-glow-premium">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" /> RETURN HOME
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto px-10 h-14 button-rose font-bold tracking-widest uppercase text-[12px] shadow-xl">
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
