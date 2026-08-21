import type { Route } from './+types/home';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { useSession } from '~/entities/session';
import { rememberedIdCookie } from '~/features/auth';
import { getInstance } from '~/shared/i18n/middleware.server';
import { Button, buttonStyles } from '~/shared/ui/button';
import { containerStyles } from '~/shared/ui/container';
import { Link } from '~/shared/ui/link';
import { Wordmark } from '~/shared/ui/wordmark';

const SAMPLE_USER_ID = '2459-4102-3156';

const heroClassName = '-mx-4 mb-8 bg-[linear-gradient(to_right,var(--color-palette-brand-100),var(--color-palette-yellow-100))] px-4 pt-16 pb-12 sm:-mx-5 sm:px-5 md:mx-0 md:mt-4 md:mb-12 md:rounded-3xl md:px-8 md:pt-14';

const ctaClassName = 'flex-1 min-[420px]:flex-none md:px-8';

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: 'popn.gg' },
    { name: 'description', content: loaderData.description },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const { t } = getInstance(context);
  return {
    description: t('home.description'),
    rememberedId: await rememberedIdCookie.read(request),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const session = useSession();

  const profileId = session.status === 'authenticated' ? session.session.id : loaderData.rememberedId;
  const isProfileCtaPending = session.status === 'pending' && !loaderData.rememberedId;

  const profileCta = profileId
    ? { to: `/user/${profileId}`, label: t('home.cta.profile') }
    : { to: `/user/${SAMPLE_USER_ID}`, label: t('home.cta.sample') };

  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <section className={heroClassName}>
        <h1 className="flex flex-wrap items-end gap-2 text-xl leading-7">
          <Wordmark className="text-[2.5rem] leading-10" />
          <span>{t('home.welcomeTo')}</span>
        </h1>

        <p className="mt-6 text-sm leading-6">
          {t('home.introduction.before')}
          {' '}
          <Link external to="https://p.eagate.573.jp/game/popn" underline="always">
            {t('home.introduction.game')}
          </Link>
          {t('home.introduction.after')}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <RouterLink
            className={buttonStyles({ variant: 'brand-solid', size: 'xl', className: ctaClassName })}
            to="/renew"
          >
            {t('home.cta.register')}
          </RouterLink>

          <Button
            className={ctaClassName}
            loading={isProfileCtaPending}
            nativeButton={false}
            render={<RouterLink to={profileCta.to} />}
            size="xl"
            variant="neutral-outline"
          >
            {profileCta.label}
          </Button>
        </div>
      </section>

      <p className="flex items-center gap-1.5 text-xs leading-5 text-fg-warning mb-8">
        <TriangleAlertIcon aria-hidden="true" className="size-3.5 shrink-0" />
        {t('home.notice')}
      </p>
    </main>
  );
}
