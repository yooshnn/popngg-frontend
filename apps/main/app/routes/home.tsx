import type { ButtonProps } from '@popngg/ui/components/button';
import type { Route } from './+types/home';
import { Button, buttonStyles, IconButton } from '@popngg/ui/components/button';
import { env } from 'cloudflare:workers';
import { ArrowRightIcon, EllipsisIcon, PlusIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader() {
  return { message: env.VALUE_FROM_CLOUDFLARE ?? '' };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Button</h1>
        <p className="text-sm text-fg-neutral-subtle">
          12 variants × 3 sizes. Hover, press, focus and disable each cell to compare.
        </p>
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
