'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center transition-transform hover:scale-105 duration-300", className)}>
      <div className="relative">
        <Image
          src="https://ik.imagekit.io/625s6afzw/logo.png"
          alt="InFaith Journey"
          width={180}
          height={50}
          className="w-full h-auto [filter:drop-shadow(0px_1px_3px_rgba(0,0,0,0.6))]"
          priority
        />
      </div>
    </div>
  );
}
