import { tv } from 'tailwind-variants';

const skeletonStyles = tv({
  base: 'animate-pulse rounded-md bg-bg-neutral-weak',
});

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={skeletonStyles({ className })} />;
}
