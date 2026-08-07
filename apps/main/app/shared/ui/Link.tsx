import type { LinkStyleProps } from '@popngg/ui/components/link';
import type { ComponentProps } from 'react';
import { linkStyles } from '@popngg/ui/components/link';
import { ArrowUpRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+\-.]*:|\/\/)/i;

export type LinkProps
  = Omit<ComponentProps<'a'>, 'className' | 'href' | 'rel' | 'target'>
    & Omit<LinkStyleProps, 'className'>
    & {
      to: string;
      className?: string;
      /** Overrides the `to` heuristic when a link has to open in a new tab regardless of its shape. */
      external?: boolean;
    };

export function Link({ to, external, variant, underline, className, children, ...props }: LinkProps) {
  const { t } = useTranslation();
  const styles = linkStyles({ variant, underline, className });

  if (external ?? ABSOLUTE_URL.test(to)) {
    return (
      <a {...props} className={styles} href={to} target="_blank" rel="noopener noreferrer">
        {children}
        <ArrowUpRightIcon aria-hidden="true" className="size-[1em] shrink-0" />
        <span className="sr-only">{t('link.newWindow')}</span>
      </a>
    );
  }

  return (
    <RouterLink {...props} className={styles} to={to}>
      {children}
    </RouterLink>
  );
}
