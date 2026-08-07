import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const linkRecipe = tv({
  base: 'inline-flex items-center gap-1 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring',
  variants: {
    variant: {
      neutral: 'text-fg-neutral-muted hover:text-fg-neutral',
      brand: 'text-fg-brand hover:text-fg-brand-contrast',
    },
    underline: {
      always: 'underline underline-offset-4',
      hover: 'underline-offset-4 hover:underline',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'brand',
    underline: 'hover',
  },
});

export type LinkStyleProps
  = VariantProps<typeof linkRecipe>
    & { className?: string };

/** Returns Link visual styles. Routing stays with the consumer, which pairs these with `<a>` or a router link. */
export function linkStyles({ variant, underline, className }: LinkStyleProps = {}) {
  return linkRecipe({ variant, underline, className });
}
