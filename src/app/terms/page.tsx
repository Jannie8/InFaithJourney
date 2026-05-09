"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EE]">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-44 md:pt-56 pb-24 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 md:space-y-16"
        >
          <header className="text-center space-y-4">
            <h1 className="text-[36px] md:text-[62px] font-headline text-primary italic leading-tight">Vendor Terms & Conditions</h1>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
            <p className="text-muted-foreground uppercase tracking-[0.2em] text-[11px] md:text-[13px] font-bold">Last Updated: October 2026</p>
          </header>

          <section className="space-y-8 md:space-y-10 text-[16px] md:text-[18px] leading-relaxed text-foreground/80 font-medium italic">
            <div className="space-y-4">
              <h2 className="text-[24px] md:text-[32px] font-headline text-primary not-italic font-bold">1. Introduction</h2>
              <p>Welcome to InFaith Journey. These Terms and Conditions govern your participation as a vendor on our platform. By applying for membership, you agree to comply with these terms.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[24px] md:text-[32px] font-headline text-primary not-italic font-bold">2. Membership & Subscription</h2>
              <p>Vendors may choose from our various membership tiers. Each tier offers specific features and visibility levels as outlined on our membership page. Subscriptions are billed monthly or annually and are non-refundable after the first 14 days.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[24px] md:text-[32px] font-headline text-primary not-italic font-bold">3. Commission Policy</h2>
              <p>In addition to membership fees, InFaith Journey charges a 5% platform commission on the total value of confirmed bookings initiated through the platform. A booking is considered confirmed once the vendor accepts the enquiry and receives a deposit from the client.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[24px] md:text-[32px] font-headline text-primary not-italic font-bold">4. Vendor Conduct</h2>
              <p>Vendors are expected to maintain professional standards of service and integrity. InFaith Journey reserves the right to terminate membership for any conduct that brings the marketplace into disrepute.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[24px] md:text-[32px] font-headline text-primary not-italic font-bold">5. Content Ownership</h2>
              <p>Vendors retain ownership of all media uploaded to their profiles but grant InFaith Journey a non-exclusive license to use these materials for marketing and promotional purposes related to the marketplace.</p>
            </div>
          </section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
