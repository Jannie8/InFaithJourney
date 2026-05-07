"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { VendorCard } from '@/components/vendors/VendorCard';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Send, Sparkles, LogIn, ArrowRight, Loader2 } from 'lucide-react';
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
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center pt-44 md:pt-56 pb-24 px-6 text-center">
          <div className="max-w-md space-y-8 md:space-y-12 animate-fade-up">
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
              <div className="relative w-full h-full rounded-full flex items-center justify-center shadow-2xl border border-primary/10 bg-white/50 backdrop-blur-sm">
                <Heart className="w-12 h-12 md:w-16 md:h-16 text-primary/30" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-headline text-[32px] md:text-[54px] leading-tight">Your Romantic Wishlist</h1>
              <p className="text-muted-foreground italic text-[16px] md:text-[20px] font-medium leading-relaxed">
                Log in to curate your perfect wedding team and save your favorite South African vendors.
              </p>
            </div>
            <Button asChild className="button-rose h-14 md:h-16 px-10 md:px-12 text-[14px] md:text-[16px] shadow-2xl golden-glow-premium">
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
      <section className="pt-44 pb-12 md:pt-48 md:pb-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] md:blur-[120px] -mr-[200px] md:-mr-[300px] -mt-[200px] md:-mt-[300px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-5 md:px-6 py-2 rounded-full text-[10px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
            <Heart className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" /> Personalized Collection
          </div>
          <h1 className="text-[36px] md:text-[82px] font-headline tracking-tight leading-tight">My Saved Vendors</h1>
          <p className="text-[16px] md:text-[24px] italic text-muted-foreground max-w-3xl mx-auto font-medium opacity-90">
            A curated selection of the finest wedding experts for your magical journey.
          </p>
          
          {savedVendors && savedVendors.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 pt-8 md:pt-10 animate-fade-up">
              <Button onClick={handleRequestAll} className="w-full sm:w-auto button-rose h-12 md:h-14 px-10 md:px-12 text-[12px] md:text-[14px] font-bold uppercase tracking-widest shadow-2xl golden-glow-premium">
                <Send className="w-4 h-4 mr-3" />
                Request Quotes ({savedVendors.length})
              </Button>
              <Button onClick={handleClearAll} variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full border-primary/20 text-primary hover:bg-primary/5 uppercase font-bold tracking-widest text-[12px] md:text-[13px] backdrop-blur-sm">
                <Trash2 className="w-4 h-4 mr-3 text-red-400" />
                Clear Wishlist
              </Button>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-24 md:pb-32 w-full flex-1">
        {!savedVendors || savedVendors.length === 0 ? (
          <div className="backdrop-blur-md border border-primary/10 rounded-[32px] md:rounded-[40px] p-10 md:p-20 text-center space-y-8 md:space-y-10 max-w-3xl mx-auto shadow-sm animate-fade-up">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary/20" />
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-[28px] md:text-[38px]">Your Wishlist is Empty</h2>
              <p className="text-muted-foreground italic text-[16px] md:text-[18px] font-medium">Explore our curated selections and click the heart icon to save your favorites.</p>
            </div>
            <div className="flex justify-center">
              <Button asChild variant="outline" className="rounded-full px-10 md:px-12 h-12 md:h-14 border-primary/20 text-primary hover:bg-primary/5 uppercase font-bold tracking-[0.2em] text-[12px] md:text-[13px] shadow-sm">
                <Link href="/vendors" className="flex items-center gap-2">
                  Start Exploring <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 animate-fade-up">
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
