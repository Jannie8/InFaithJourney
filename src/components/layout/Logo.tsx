
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative h-12 w-48 md:h-14 md:w-56">
        <Image
          src="https://ik.imagekit.io/625s6afzw/logo.png"
          alt="InFaith Journey"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
