import type { Route } from './+types/route';
import { useTranslation } from 'react-i18next';
import { rememberedIdCookie } from '~/features/auth';
import { getInstance } from '~/shared/i18n/middleware.server';
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
  return [{ title: loaderData.title }];
}

export default function LoginRoute({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <main className="mx-auto min-h-svh w-full max-w-xl px-4 py-12" aria-labelledby="login-title">
      <section>
        <h1 className="text-2xl font-semibold" id="login-title">
          {t('login.title')}
        </h1>
        <p className="mt-2 text-sm text-fg-neutral-muted">
          {t('login.description')}
        </p>

        <LoginForm
          defaultPoptomoId={loaderData.rememberedId}
          redirectTo={loaderData.redirectTo}
        />
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
