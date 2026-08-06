import type { ButtonProps } from '@popngg/ui/components/button';
import type { Route } from './+types/home';
import type { SupportedLanguage } from '~/shared/i18n';
import { Button, buttonStyles, IconButton } from '@popngg/ui/components/button';
import { env } from 'cloudflare:workers';
import { ArrowRightIcon, EllipsisIcon, PlusIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';
import { fallbackLanguage, localeCookie, supportedLanguages } from '~/shared/i18n';
import { getInstance } from '~/shared/i18n/middleware';
import { usePreferences } from '~/shared/preferences';

type Variant = NonNullable<ButtonProps['variant']>;

const VARIANTS = [
  'neutral-solid',
  'neutral-weak',
  'neutral-outline',
  'neutral-ghost',
  'brand-solid',
  'brand-weak',
  'brand-outline',
  'brand-ghost',
  'critical-solid',
  'critical-weak',
  'critical-outline',
  'critical-ghost',
] as const satisfies readonly Variant[];

const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly NonNullable<ButtonProps['size']>[];

const FLAGS = { ko: '🇰🇷', ja: '🇯🇵' } as const satisfies Record<SupportedLanguage, string>;

function LocaleToggle() {
  const { t, i18n } = useTranslation();
  const { revalidate } = useRevalidator();

  const current = supportedLanguages.find(lng => lng === i18n.language) ?? fallbackLanguage;
  const next = current === 'ko' ? 'ja' : 'ko';

  async function switchTo(lng: SupportedLanguage) {
    await localeCookie.write(lng);
    await i18n.changeLanguage(lng);
    await revalidate();
  }

  return (
    <button
      type="button"
      aria-label={t('localeToggle')}
      className="w-fit cursor-pointer rounded-lg border border-stroke-neutral-weak px-3 py-2 text-xl"
      onClick={() => void switchTo(next)}
    >
      {FLAGS[current]}
    </button>
  );
}

function TitleToggle() {
  const { title, setPreference } = usePreferences();
  const next = title === 'song' ? 'genre' : 'song';

  return (
    <button
      type="button"
      className="w-fit cursor-pointer rounded-lg border border-stroke-neutral-weak px-3 py-2 text-sm"
      onClick={() => void setPreference('title', next)}
    >
      {title}
    </button>
  );
}

function LoadingDemo({ variant }: { variant: Variant }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = setTimeout(setLoading, 1000, false);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Button variant={variant} loading={loading} onClick={() => setLoading(true)}>
      loading
    </Button>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData.title },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    message: env.VALUE_FROM_CLOUDFLARE ?? '',
    title: getInstance(context).t('demo'),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">i18n</h1>
      </header>

      <section className="flex flex-col gap-2" aria-labelledby="i18n-heading">
        <p>팝픈 ポップン pop&apos;n</p>
        <p>{t('demo')}</p>
        <LocaleToggle />
        <TitleToggle />
      </section>

      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">button</h1>
      </header>

      <section className="flex flex-col gap-6">
        {VARIANTS.map(variant => (
          <div key={variant} className="flex flex-col gap-2">
            <h2 className="font-mono text-xs text-fg-neutral-subtle">{variant}</h2>
            <div className="flex flex-wrap items-center gap-3">
              {SIZES.map(size => (
                <Button key={size} variant={variant} size={size}>
                  {size}
                </Button>
              ))}
              <LoadingDemo variant={variant} />
              <Button variant={variant} disabled>disabled</Button>
              <Button variant={variant} prefixIcon={<PlusIcon />}>prefix</Button>
              <Button variant={variant} suffixIcon={<ArrowRightIcon />}>suffix</Button>
              <IconButton variant={variant} aria-label={`${variant} more`}>
                <EllipsisIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-mono text-xs text-fg-neutral-subtle">width · link styles</h2>
        <Button variant="brand-solid" size="lg" width="full" prefixIcon={<SlidersHorizontalIcon />}>
          width=full
        </Button>
        <Button variant="neutral-outline" size="lg" width="fit" prefixIcon={<SlidersHorizontalIcon />}>
          width=fit
        </Button>
        <a
          className={buttonStyles({ variant: 'neutral-ghost' })}
          href="https://base-ui.com/react/components/button"
        >
          styled anchor
        </a>
      </section>

      <footer className="text-xs text-fg-placeholder">
        VALUE_FROM_CLOUDFLARE:
        {' '}
        {loaderData.message || '(unset)'}
      </footer>
    </main>
  );
}
