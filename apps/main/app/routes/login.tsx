import type { Route } from './+types/login';
import { buttonStyles } from '@popngg/ui/components/button';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { LoginForm } from '~/features/auth';
import { getInstance } from '~/shared/i18n/middleware';
import { pageTitle } from '~/shared/seo';
import { Link, PageHeader, Wordmark } from '~/shared/ui';

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: pageTitle(loaderData.title) }];
}

export function loader({ context }: Route.LoaderArgs) {
  return { title: getInstance(context).t('login.title') };
}

export default function Login() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-14">
      <Wordmark />

      <section className="w-full max-w-120 py-10 md:py-14" aria-labelledby="login-title">
        <PageHeader
          description={t('login.description')}
          title={t('login.title')}
          titleId="login-title"
        />

        <LoginForm />

        <RouterLink
          className={buttonStyles({ size: 'xl', variant: 'neutral-outline', width: 'full', className: 'mt-3 gap-1.5 text-sm' })}
          to="/register"
        >
          <span className="text-fg-neutral-subtle">{t('login.register.prefix')}</span>
          <span>{t('login.register.label')}</span>
        </RouterLink>

        <aside className="mt-8 rounded-xl bg-bg-neutral-weak px-5 py-4" aria-label={t('login.help.ariaLabel')}>
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
