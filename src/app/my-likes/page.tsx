
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Send, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { collection, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function MyLikesPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const savedVendorsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, 'users', user.uid, 'saved_vendors');
  }, [user, db]);

  const { data: savedVendors, isLoading } = useCollection(savedVendorsQuery);

  const handleClearAll = async () => {
    if (!user || !db || !savedVendors) return;
    const batch = writeBatch(db);
    savedVendors.forEach((v) => {
      const ref = doc(db, 'users', user.uid, 'saved_vendors', v.id);
      batch.delete(ref);
    });
    await batch.commit();
    toast({
      title: "Wishlist Cleared",
      description: "All saved vendors have been removed from your wishlist."
    });
  };

  const handleRequestAll = () => {
    toast({
      title: "Bulk Quote Request Initiated",
      description: `Requesting tailored quotes from all ${savedVendors?.length} saved vendors...`
    });
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="relative">
          <Sparkles className="w-12 h-12 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-12 animate-fade-up">
            <div className="relative w-32 h-32 mx-auto">
              {/* Outer ping animation with enough room to expand without cropping */}
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border border-primary/10 bg-white/50 backdrop-blur-sm">
                <Heart className="w-16 h-16 text-primary/30" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-headline text-[36px] md:text-[54px] leading-tight">Your Romantic Wishlist</h1>
              <p className="text-muted-foreground italic text-[18px] md:text-[20px] font-medium leading-relaxed">
                Log in to curate your perfect wedding team and save your favorite South African vendors.
              </p>
            </div>
            <Button asChild className="button-rose h-16 px-12 text-[16px] shadow-2xl golden-glow-premium">
              <Link href="/dashboard" className="flex items-center gap-3">
                <LogIn className="w-5 h-5" />
                LOGIN TO START SAVING
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Premium Header */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 px-6 relative">
        {/* Decorative background contained in a pointer-events-none layer to avoid clipping content */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-[300px] -mt-[300px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
            <Heart className="w-3.5 h-3.5 fill-current" /> Personalized Collection
          </div>
          <h1 className="text-[48px] md:text-[82px] font-headline tracking-tight leading-none">My Saved Vendors</h1>
          <p className="text-[18px] md:text-[24px] italic text-muted-foreground max-w-3xl mx-auto font-medium opacity-90">
            A curated selection of the finest wedding experts for your magical journey.
          </p>
          
          {savedVendors && savedVendors.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-5 pt-10 animate-fade-up">
              <Button onClick={handleRequestAll} className="button-rose h-14 px-12 text-[14px] font-bold uppercase tracking-widest shadow-2xl golden-glow-premium">
                <Send className="w-4 h-4 mr-3" />
                Request Quotes from All ({savedVendors.length})
              </Button>
              <Button onClick={handleClearAll} variant="outline" className="h-14 px-10 rounded-full border-primary/20 text-primary hover:bg-primary/5 uppercase font-bold tracking-widest text-[13px] backdrop-blur-sm">
                <Trash2 className="w-4 h-4 mr-3 text-red-400" />
                Clear My Wishlist
              </Button>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-32 w-full flex-1">
        {!savedVendors || savedVendors.length === 0 ? (
          <div className="backdrop-blur-md border border-primary/10 rounded-[40px] p-10 md:p-20 text-center space-y-10 max-w-3xl mx-auto shadow-sm animate-fade-up">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-primary/20" />
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-[32px] md:text-[38px]">Your Wishlist is Empty</h2>
              <p className="text-muted-foreground italic text-[18px] font-medium">Explore our curated selections and click the heart icon to save your favorites.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full px-12 h-14 border-primary/20 text-primary hover:bg-primary/5 uppercase font-bold tracking-[0.2em] text-[13px] shadow-sm">
              <Link href="/vendors" className="flex items-center gap-2">
                Start Exploring <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 animate-fade-up">
            {savedVendors.map((vendor) => (
              <VendorCard 
                key={vendor.id} 
                {...vendor} 
                showActions 
                onRemove={() => deleteDoc(doc(db, 'users', user.uid, 'saved_vendors', vendor.id))}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
