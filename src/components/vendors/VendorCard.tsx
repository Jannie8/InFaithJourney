
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface VendorCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  imageUrl: string;
  imageHint: string;
  showActions?: boolean;
  onRemove?: () => void;
}

export function VendorCard({ 
  id, 
  name, 
  location, 
  rating, 
  reviews, 
  category, 
  imageUrl, 
  imageHint,
  showActions = false,
  onRemove
}: VendorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const savedRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid, 'saved_vendors', id);
  }, [user, db, id]);

  const { data: savedData } = useDoc(savedRef);
  const isLiked = !!savedData;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !db || !savedRef) {
      toast({
        title: "Sign in required",
        description: "Please log in to save your favorite vendors to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    if (isLiked) {
      deleteDoc(savedRef);
    } else {
      setDoc(savedRef, {
        id, name, location, rating, reviews, category, imageUrl, imageHint,
        savedAt: new Date().toISOString()
      });
      toast({
        title: "Saved to Wishlist",
        description: `${name} has been added to your romantic collection.`
      });
    }
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "group luxury-card overflow-hidden flex flex-col bg-white w-full mx-auto max-w-[400px] lg:max-w-none relative",
        "opacity-0 translate-y-8 transition-all duration-700 ease-out",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      {/* Heart Toggle Icon - Top Right */}
      <button 
        onClick={handleLikeToggle}
        className={cn(
          "absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md",
          isLiked 
            ? "bg-primary text-white scale-110" 
            : "bg-white/80 text-primary hover:bg-white hover:scale-110"
        )}
      >
        <Heart className={cn("w-5 h-5 transition-transform group-hover:scale-110", isLiked && "fill-current")} />
      </button>

      {/* 16:9 Aspect Ratio Container */}
      <div className="relative aspect-video w-full overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover sepia-overlay transition-transform duration-[2000ms] group-hover:scale-110"
          data-ai-hint={imageHint}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/95 text-primary border-none font-bold px-4 py-1.5 shadow-md uppercase text-[10px] tracking-[0.15em] rounded-full">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-headline text-[19px] md:text-[20px] font-semibold text-foreground mb-2 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-primary/80 shrink-0" />
          <span className="text-[14.5px] font-medium truncate">{location}</span>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn(
                "w-4 h-4 transition-all duration-300",
                i < Math.floor(rating) ? 'fill-secondary text-secondary drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]' : 'text-muted-foreground/30'
              )} />
            ))}
          </div>
          <span className="text-[14px] font-bold text-foreground/70 ml-2">
            {reviews} Reviews
          </span>
        </div>

        {/* Buttons Row */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Button asChild className="flex-1 h-11 px-4 rounded-xl text-[13px] font-bold uppercase tracking-[0.1em] button-rose golden-glow-premium whitespace-nowrap overflow-hidden text-ellipsis min-w-[110px]">
              <Link href={`/vendor/${id}`}>PROFILE</Link>
            </Button>
            <Button variant="outline" asChild className="h-11 w-11 p-0 rounded-xl border-primary/25 text-primary hover:bg-primary/5 shrink-0 transition-all hover:border-primary/50">
              <Link href={`/vendor/${id}#quote`} title="Request Quote">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          {showActions && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10">
              <Button 
                variant="ghost" 
                onClick={(e) => { e.preventDefault(); onRemove?.(); }}
                className="text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 h-9"
              >
                REMOVE
              </Button>
              <Button asChild variant="ghost" className="text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 h-9">
                <Link href={`/vendor/${id}`}>VIEW</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
