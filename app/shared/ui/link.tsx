import type { ComponentProps } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { ArrowUpRightIcon } from 'lucide-react';
import { Link as RouterLink } from 'react-router';
import { tv } from 'tailwind-variants';

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+\-.]*:|\/\/)/i;

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

export function linkStyles({ variant, underline, className }: LinkStyleProps = {}) {
  return linkRecipe({ variant, underline, className });
}

export type LinkProps
  = Omit<ComponentProps<'a'>, 'className' | 'href' | 'rel' | 'target'>
    & Omit<LinkStyleProps, 'className'>
    & {
      to: string;
      className?: string;
      external?: boolean;
    };

export function Link({ to, external, variant, underline, className, children, ...props }: LinkProps) {
  const styles = linkStyles({ variant, underline, className });

  if (external ?? ABSOLUTE_URL.test(to)) {
    return (
      <a {...props} className={styles} href={to} target="_blank" rel="noopener noreferrer">
        {children}
        <ArrowUpRightIcon aria-hidden="true" className="size-[1em] shrink-0" />
      </a>
    );
  }

  return (
    <RouterLink {...props} className={styles} to={to}>
      {children}
    </RouterLink>
  );
}
