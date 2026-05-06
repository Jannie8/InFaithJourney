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
        title: "Account Required",
        description: "Please sign in to save vendors to your wishlist.",
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
        title: "Added to Wishlist",
        description: `${name} has been saved.`
      });
    }
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "group luxury-card overflow-hidden flex flex-col bg-card w-full mx-auto max-w-[400px] lg:max-w-none relative",
        "opacity-0 translate-y-8 transition-all duration-700 ease-out",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <button 
        onClick={handleLikeToggle}
        className={cn(
          "absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md",
          isLiked 
            ? "bg-secondary text-white scale-110" 
            : "bg-black/40 text-white hover:bg-black/60 hover:scale-110"
        )}
      >
        <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current")} />
      </button>

      <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          data-ai-hint={imageHint}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-secondary text-white border-none font-bold px-4 py-1.5 shadow-md uppercase text-[9px] tracking-[0.15em] rounded-full">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-headline text-[18px] md:text-[20px] font-semibold text-foreground mb-2 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="text-[14px] font-medium truncate">{location}</span>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn(
                "w-3.5 h-3.5 transition-all duration-300",
                i < Math.floor(rating) ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'
              )} />
            ))}
          </div>
          <span className="text-[12px] font-bold text-muted-foreground ml-2">
            ({reviews})
          </span>
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Button asChild className="flex-1 h-11 px-4 rounded-xl text-[12px] font-bold uppercase tracking-[0.1em] button-rose whitespace-nowrap overflow-hidden text-ellipsis">
              <Link href={`/vendor/${id}`}>VIEW PROFILE</Link>
            </Button>
            <Button variant="outline" asChild className="h-11 w-11 p-0 rounded-xl border-border text-primary hover:bg-muted shrink-0 transition-all">
              <Link href={`/vendor/${id}#quote`} title="Request Quote">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          {showActions && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <Button 
                variant="ghost" 
                onClick={(e) => { e.preventDefault(); onRemove?.(); }}
                className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 h-9"
              >
                REMOVE
              </Button>
              <Button asChild variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-muted h-9">
                <Link href={`/vendor/${id}`}>VIEW</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
