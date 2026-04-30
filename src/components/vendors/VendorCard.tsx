import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VendorCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  imageUrl: string;
  imageHint: string;
  priceRange?: string;
}

export function VendorCard({ id, name, location, rating, reviews, category, imageUrl, imageHint }: VendorCardProps) {
  return (
    <div className="group luxury-card overflow-hidden h-full flex flex-col bg-white">
      <div className="relative h-[220px] w-full overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover sepia-overlay transition-transform duration-[1200ms] group-hover:scale-105"
          data-ai-hint={imageHint}
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/95 text-primary border-none font-bold px-3 py-1 shadow-sm uppercase text-[10px] tracking-[0.1em] rounded-full">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-headline text-[19px] font-semibold text-foreground mb-1 line-clamp-2 leading-tight">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
          <MapPin className="w-3.5 h-3.5 text-primary/70" />
          <span className="text-[14.5px] font-medium opacity-90">{location}</span>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
          <span className="text-[13.5px] font-bold text-foreground/80 ml-1">
            {reviews} JJs
          </span>
        </div>

        <div className="mt-auto space-y-3 pt-3">
          <Button asChild className="w-full button-rose h-11 text-[15px] font-semibold">
            <Link href={`/vendor/${id}`}>VIEW PROFILE</Link>
          </Button>
          <Button variant="outline" asChild className="w-full rounded-full border-primary/20 text-primary hover:bg-primary/5 h-11 uppercase text-[11px] font-bold tracking-[0.2em]">
            <Link href={`/vendor/${id}#quote`}>REQUEST QUOTE</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
