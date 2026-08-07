import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export function Wordmark({ variant = 'solid' }: { variant?: 'solid' | 'split' }) {
  const { t } = useTranslation();

  if (variant === 'split') {
    return (
      <span className="font-brand text-lg tracking-tighter">
        <span className="text-fg-brand">popn.gg</span>
      </span>
    );
  }

  return (
    <Link
      className="font-brand shrink-0 text-lg leading-none tracking-tighter text-fg-brand focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stroke-focus-ring"
      to="/"
      aria-label={t('header.home')}
    >
      popn.gg
    </Link>
  );
}
