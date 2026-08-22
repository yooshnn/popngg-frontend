import type { Route } from './+types/route';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInstance } from '~/shared/i18n/middleware.server';
import { pageTitle } from '~/shared/lib/seo';
import { containerStyles } from '~/shared/ui/container';
import { Notice } from '~/shared/ui/notice';
import { PageHeader } from '~/shared/ui/page-header';
import { SegmentedControl } from '~/shared/ui/segmented-control';
import { RenewSteps } from './ui/renew-steps';

const MOBILE_USER_AGENT = /android|iphone|ipad|ipod/i;

type RenewPlatform = 'desktop' | 'mobile';

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: pageTitle(loaderData.title) }];
}

export function loader({ context, request }: Route.LoaderArgs) {
  return {
    title: getInstance(context).t('renew.title'),
    isMobile: MOBILE_USER_AGENT.test(request.headers.get('user-agent') ?? ''),
    origin: new URL(request.url).origin,
  };
}

export default function RenewRoute({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<RenewPlatform>(loaderData.isMobile ? 'mobile' : 'desktop');

  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <section aria-labelledby="renew-title" className="py-8 md:py-12">
        <PageHeader
          description={t('renew.description')}
          title={t('renew.title')}
          titleId="renew-title"
        />

        <Notice className="mt-6" variant="informative">
          {t('renew.requirement')}
        </Notice>

        <SegmentedControl
          aria-label={t('renew.platform.label')}
          className="mt-8"
          options={[
            { label: t('renew.platform.desktop'), value: 'desktop' },
            { label: t('renew.platform.mobile'), value: 'mobile' },
          ]}
          value={platform}
          onValueChange={setPlatform}
        />

        <ol className="mt-8 flex flex-col gap-8">
          <RenewSteps origin={loaderData.origin} platform={platform} />
        </ol>
      </section>
    </main>
  );
}
