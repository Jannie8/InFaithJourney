
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative h-20 w-72 md:h-32 md:w-[480px]">
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
