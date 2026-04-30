
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
        "group luxury-card overflow-hidden h-full flex flex-col bg-white golden-glow-premium",
        "opacity-0 translate-y-8 transition-all duration-700 ease-out",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="relative h-[220px] w-full overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover sepia-overlay transition-transform duration-[1500ms] group-hover:scale-110"
          data-ai-hint={imageHint}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-primary border-none font-bold px-4 py-1.5 shadow-md uppercase text-[10px] tracking-[0.15em] rounded-full">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-headline text-[18px] font-semibold text-foreground mb-1.5 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground mb-3 opacity-90">
          <MapPin className="w-4 h-4 text-primary/80" />
          <span className="text-[14px] font-medium truncate">{location}</span>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn(
                "w-3.5 h-3.5 transition-all duration-300",
                i < Math.floor(rating) ? 'fill-secondary text-secondary drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]' : 'text-muted-foreground/30'
              )} />
            ))}
          </div>
          <span className="text-[13px] font-bold text-foreground/75 ml-1.5 whitespace-nowrap">
            {reviews} Reviews
          </span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <Button asChild className="flex-1 min-w-[120px] h-10 px-4 py-2 rounded-[12px] text-[13px] font-bold uppercase tracking-[0.1em] button-rose whitespace-nowrap golden-glow-premium overflow-hidden text-ellipsis">
            <Link href={`/vendor/${id}`}>PROFILE</Link>
          </Button>
          <Button variant="outline" asChild className="w-10 h-10 p-0 rounded-[12px] border-primary/25 text-primary hover:bg-primary/5 shrink-0 transition-all duration-300 hover:border-primary/50">
            <Link href={`/vendor/${id}#quote`} title="Request Quote">
              <MessageCircle className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
