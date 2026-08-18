import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router';
import { Button, buttonStyles } from '~/shared/ui/button';
import { containerStyles } from '~/shared/ui/container';

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <section
        aria-labelledby="not-found-title"
        className="flex min-h-[60svh] flex-col items-center justify-center py-16 text-center"
      >
        <p className="font-mono text-sm font-medium tracking-[.2em] tabular-nums text-fg-neutral-muted">
          404
        </p>

        <h1
          className="mt-4 text-3xl font-bold tracking-[-.04em] md:text-4xl"
          id="not-found-title"
        >
          {t('notFound.title')}
        </h1>

        <p className="mt-3 max-w-105 text-sm leading-6 text-fg-neutral-muted">
          {t('notFound.description')}
        </p>

        <div className="mt-8 flex items-center gap-2">
          <Button size="sm" variant="neutral-ghost" onClick={() => void navigate(-1)}>
            {t('notFound.back')}
          </Button>
          <RouterLink className={buttonStyles({ size: 'sm', variant: 'neutral-outline' })} to="/">
            {t('notFound.home')}
          </RouterLink>
        </div>
      </section>
    </main>
  );
}
