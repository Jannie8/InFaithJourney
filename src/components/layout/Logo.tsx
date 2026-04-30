import React from 'react';
import { cn } from '@/lib/utils';
import { Cross } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex items-center justify-center w-10 h-10 border border-primary/20 rounded-full">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-5 h-5 text-primary"
        >
          <path d="M12 3L4 11v10h16V11L12 3z" />
          <path d="M12 11v4M10 13h4" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-script text-3xl text-primary tracking-tight">InFaith</span>
        <span className="text-[10px] tracking-[0.3em] font-bold uppercase -mt-1 opacity-70 font-headline">JOURNEY</span>
      </div>
    </div>
  );
}
