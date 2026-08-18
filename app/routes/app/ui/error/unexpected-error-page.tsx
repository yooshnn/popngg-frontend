import { useTranslation } from 'react-i18next';
import { containerStyles } from '~/shared/ui/container';

export function UnexpectedErrorPage() {
  const { t } = useTranslation();

  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <section className="flex min-h-[60svh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-[2rem] leading-tight font-bold tracking-[-.04em] md:text-4xl">
          {t('dataState.error.title')}
        </h1>
        <p className="mt-3 max-w-105 text-sm leading-6 text-fg-neutral-muted">
          {t('dataState.error.description')}
        </p>
      </section>
    </main>
  );
}
