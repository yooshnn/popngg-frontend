import type { ButtonProps } from '@popngg/ui/components/button';
import type { DehydratedState, UseQueryOptions } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { SupportedLanguage } from '~/shared/i18n';
import type { Title } from '~/shared/preferences';
import { Button, buttonStyles, IconButton } from '@popngg/ui/components/button';
import { HydrationBoundary, useQuery } from '@tanstack/react-query';
import { ArrowRightIcon, EllipsisIcon, PlusIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';
import { http } from '~/shared/api';
import { fallbackLanguage, localeCookie, supportedLanguages } from '~/shared/i18n';
import { usePreferences } from '~/shared/preferences';

function DemoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children}
    </section>
  );
}

// i18n

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

export function I18nDemoSection() {
  const { t } = useTranslation();

  return (
    <DemoSection title="i18n">
      <p>팝픈 ポップン pop&apos;n</p>
      <p>{t('demo')}</p>
      <LocaleToggle />
    </DemoSection>
  );
}

// preferences

const TRACK = { song: 'neu', genre: 'NIENTE' } as const satisfies Record<Title, string>;

function TrackName() {
  const { title } = usePreferences();

  return <p>{TRACK[title]}</p>;
}

function TitleToggle() {
  const { title, setPreference } = usePreferences();
  const next = title === 'song' ? 'genre' : 'song';

  return (
    <button
      type="button"
      className="w-fit cursor-pointer rounded-lg border border-stroke-neutral-weak px-3 py-2 text-sm"
      onClick={() => setPreference('title', next)}
    >
      {title}
    </button>
  );
}

export function PreferencesDemoSection() {
  return (
    <DemoSection title="preferences">
      <TrackName />
      <TitleToggle />
    </DemoSection>
  );
}

// api

export interface PingResult {
  message: string;
  cookie: string | null;
}

/** Works on the server (pass the context-bound request) or the browser (default). */
export function pingQuery(request = http()) {
  return {
    queryKey: ['ping'] as const,
    queryFn: () => request<PingResult>('ping'),
  };
}

/** Works on the server (pass the context-bound request) or the browser (default). */
export function pongQuery(request = http()) {
  return {
    queryKey: ['pong'] as const,
    queryFn: () => request<PingResult>('pong'),
  };
}

function QueryDemoCard({ title, query }: { title: string; query: UseQueryOptions<PingResult> }) {
  const { data, isLoading, error, isFetching, refetch } = useQuery(query);
  const message = error?.message ?? (isLoading ? '…' : data?.message);

  return (
    <section className="rounded-lg border border-stroke-neutral-weak p-4 text-left text-sm">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-medium">{title}</h2>
        <Button
          variant="neutral-outline"
          size="sm"
          loading={isFetching}
          onClick={() => void refetch()}
        >
          refetch
        </Button>
      </header>

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-fg-neutral-subtle">message</dt>
        <dd>{message}</dd>

        <dt className="text-fg-neutral-subtle">cookie</dt>
        <dd className="break-all">{data?.cookie ?? '(none)'}</dd>
      </dl>
    </section>
  );
}

export function ApiDemoSection({
  ping,
  pong,
  dehydratedState,
}: {
  ping: PingResult;
  pong: PingResult;
  dehydratedState: DehydratedState;
}) {
  return (
    <DemoSection title="api">
      <div className="flex w-fit items-center gap-3 rounded-lg bg-bg-neutral-weak p-3">
        <p>{ping.message}</p>
        <p>{pong.message}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <HydrationBoundary state={dehydratedState}>
          <QueryDemoCard title="SSR" query={pingQuery()} />
        </HydrationBoundary>
        <QueryDemoCard title="CSR" query={pongQuery()} />
      </div>
    </DemoSection>
  );
}

// button

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

function VariantRow({ variant }: { variant: Variant }) {
  return (
    <div className="flex flex-col gap-2">
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
  );
}

export function ButtonGallerySection() {
  return (
    <DemoSection title="button">
      <div className="flex flex-col gap-6">
        {VARIANTS.map(variant => (
          <VariantRow key={variant} variant={variant} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
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
      </div>
    </DemoSection>
  );
}
