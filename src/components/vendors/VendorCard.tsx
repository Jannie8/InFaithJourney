
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Tag } from 'lucide-react';
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
  capacity?: string;
}

export function VendorCard({ id, name, location, rating, reviews, category, imageUrl, imageHint, priceRange, capacity }: VendorCardProps) {
  return (
    <div className="group bg-white/50 backdrop-blur-sm border border-primary/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover sepia-overlay transition-transform duration-700 group-hover:scale-110"
          data-ai-hint={imageHint}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-primary border-none font-medium px-3 py-1 shadow-sm uppercase tracking-tighter">
            {category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline text-xl group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center gap-1 text-sm font-bold text-primary">
            <Star className="w-4 h-4 fill-primary" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-muted-foreground font-normal">({reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {priceRange && (
            <div className="flex items-center gap-1.5 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
              <span>FROM {priceRange}</span>
            </div>
          )}
          {capacity && (
            <div className="flex items-center gap-1.5 bg-secondary/20 text-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
              <span>{capacity} GUESTS</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary/5">
            <Link href={`/vendor/${id}`}>VIEW PROFILE</Link>
          </Button>
          <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">
            <Link href={`/vendor/${id}#quote`}>REQUEST QUOTE</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
