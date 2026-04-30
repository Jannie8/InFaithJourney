import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="w-full h-full text-primary"
        >
          {/* Subtle Arch/Chapel Icon */}
          <path d="M4 22V10a8 8 0 0 1 16 0v12" />
          <path d="M12 11V7" />
          <path d="M10 9h4" />
          <rect x="9" y="16" width="6" height="6" rx="1" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-script text-4xl text-primary tracking-tight">InFaith</span>
        <span className="text-[10px] tracking-[0.4em] font-bold uppercase -mt-1 opacity-80 font-headline text-foreground/70">JOURNEY</span>
      </div>
    </div>
  );
}
