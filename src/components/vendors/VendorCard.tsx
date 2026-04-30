"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface VendorCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  imageUrl: string;
  imageHint: string;
}

export function VendorCard({ id, name, location, rating, reviews, category, imageUrl, imageHint }: VendorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div 
      ref={cardRef}
      className={cn(
        "group luxury-card overflow-hidden flex flex-col bg-white w-full mx-auto max-w-[400px] lg:max-w-none",
        "opacity-0 translate-y-8 transition-all duration-700 ease-out",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
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

        {/* Buttons Row - Optimized for Mobile & Legibility */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <Button asChild className="flex-1 h-12 px-6 rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] button-rose golden-glow-premium whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
            <Link href={`/vendor/${id}`}>PROFILE</Link>
          </Button>
          <Button variant="outline" asChild className="h-12 w-12 p-0 rounded-xl border-primary/25 text-primary hover:bg-primary/5 shrink-0 transition-all hover:border-primary/50">
            <Link href={`/vendor/${id}#quote`} title="Request Quote">
              <MessageCircle className="w-5.5 h-5.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
