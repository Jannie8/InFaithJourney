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

export function VendorCard({ id, name, location, rating, reviews, category, imageUrl, imageHint, priceRange }: VendorCardProps) {
  return (
    <div className="group luxury-card overflow-hidden">
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover sepia-overlay transition-transform duration-1000 group-hover:scale-110"
          data-ai-hint={imageHint}
        />
        <div className="absolute top-5 left-5">
          <Badge className="bg-white/95 text-primary border-none font-bold px-3 py-1.5 shadow-sm uppercase text-[10px] tracking-widest">
            {category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      <div className="p-7">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline text-2xl group-hover:text-primary transition-colors leading-tight">{name}</h3>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 text-primary/60" />
          <span className="tracking-wide uppercase text-[11px] font-semibold">{location}</span>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
          <span className="text-[12px] font-bold text-foreground/70 ml-1">{reviews} REVIEWS</span>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild className="w-full rounded-full button-rose h-12 uppercase text-[11px] font-bold tracking-[0.2em]">
            <Link href={`/vendor/${id}`}>VIEW PROFILE</Link>
          </Button>
          <Button variant="outline" asChild className="w-full rounded-full border-primary/20 text-primary hover:bg-primary/5 h-12 uppercase text-[11px] font-bold tracking-[0.2em]">
            <Link href={`/vendor/${id}#quote`}>REQUEST QUOTE</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
