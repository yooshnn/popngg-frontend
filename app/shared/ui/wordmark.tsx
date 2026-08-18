import { tv } from 'tailwind-variants';

const wordmarkRecipe = tv({
  base: 'font-brand shrink-0 text-lg leading-none tracking-tighter text-fg-brand',
});

export interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return <span className={wordmarkRecipe({ className })}>popn.gg</span>;
}
