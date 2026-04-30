
import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="w-6 h-6 text-primary"
        >
          <path d="M12 2L4 10v12h16V10L12 2z" />
          <path d="M12 10v4M10 12h4" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-headline italic text-2xl text-primary tracking-tight">InFaith</span>
        <span className="text-[10px] tracking-[0.2em] font-bold uppercase -mt-1 opacity-80">JOURNEY</span>
      </div>
    </div>
  );
}
