
'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 shadow-xl p-2 md:p-3 transition-all duration-300 hover:bg-black/30", 
      className
    )}>
      <div className="relative h-[48px] w-[180px] md:h-[72px] md:w-[320px]">
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
