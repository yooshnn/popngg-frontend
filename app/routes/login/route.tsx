import type { Route } from './+types/route';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { rememberedIdCookie } from '~/features/auth';
import { getInstance } from '~/shared/i18n/middleware.server';
import { pageTitle } from '~/shared/lib/seo';
import { buttonStyles } from '~/shared/ui/button';
import { Link } from '~/shared/ui/link';
import { FocusHeader } from '~/widgets/focus-header';
import { LoginForm } from './ui/login-form';

export async function loader({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const requestedRedirect = url.searchParams.get('redirectTo');

  return {
    redirectTo: getInternalRedirect(requestedRedirect, url),
    rememberedId: await rememberedIdCookie.read(request),
    title: getInstance(context).t('login.title'),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData ? [{ title: pageTitle(loaderData.title) }] : [];
}

export function ErrorBoundary() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-14">
      <FocusHeader className="max-w-120" />
      <section className="flex w-full max-w-120 flex-1 flex-col justify-center py-10 text-center md:py-14">
        <h1 className="text-[2rem] leading-tight font-bold tracking-[-.04em] md:text-4xl">
          {t('dataState.error.title')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-fg-neutral-muted">
          {t('dataState.error.description')}
        </p>
      </section>
    </main>
  );
}

export default function LoginRoute({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-14">
      <FocusHeader className="max-w-120" />

      <section className="w-full max-w-120 py-10 md:py-14" aria-labelledby="login-title">
        <header className="max-w-[650px]">
          <h1 className="text-[2rem] leading-tight font-bold tracking-[-.04em] md:text-4xl" id="login-title">
            {t('login.title')}
          </h1>
          <p className="mt-3 text-sm leading-6 text-fg-neutral-muted">
            {t('login.description')}
          </p>
        </header>

        <LoginForm
          defaultPoptomoId={loaderData.rememberedId}
          redirectTo={loaderData.redirectTo}
        />

        <RouterLink
          className={buttonStyles({
            className: 'mt-3 gap-1.5 text-sm',
            size: 'xl',
            variant: 'neutral-outline',
            width: 'full',
          })}
          to="/renew"
        >
          <span className="text-fg-neutral-subtle">{t('login.register.prefix')}</span>
          <span>{t('login.register.label')}</span>
        </RouterLink>

        <aside className="mt-8 rounded-xl bg-bg-neutral-weak px-5 py-4">
          <p className="text-sm font-semibold text-fg-neutral">{t('login.help.title')}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link to="https://p.eagate.573.jp/game/popn" underline="always" variant="neutral">
              {t('login.help.findId')}
            </Link>
            <Link to="https://forms.gle/b1BUfY6pDaRpdC6w5" underline="always" variant="neutral">
              {t('login.help.passwordInquiry')}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function getInternalRedirect(value: string | null, baseUrl: URL): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  const redirectUrl = new URL(value, baseUrl);

  if (redirectUrl.origin !== baseUrl.origin) {
    return '/';
  }

  return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
}
