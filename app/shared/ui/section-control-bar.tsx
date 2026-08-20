import type { ReactNode } from 'react';
import { tv } from 'tailwind-variants';

const sectionControlBarStyles = tv({
  base: 'flex flex-wrap items-center justify-between gap-2 border-y border-stroke-neutral-weak py-2.5',
});

export interface SectionControlBarProps {
  children: ReactNode;
  className?: string;
}

/** Groups section-scoped controls in a consistent horizontal strip. */
export function SectionControlBar({ children, className }: SectionControlBarProps) {
  return (
    <div className={sectionControlBarStyles({ className })}>
      {children}
    </div>
  );
}
