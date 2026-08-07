import type { Route } from './+types/home';
import type { PingResult } from './home.demo';
import { dehydrate } from '@tanstack/react-query';
import { env } from 'cloudflare:workers';
import { getQueryClient, http } from '~/shared/api';
import { getInstance } from '~/shared/i18n/middleware';
import { ApiDemoSection, ButtonGallerySection, I18nDemoSection, pingQuery, PreferencesDemoSection } from './home.demo';

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData.title },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const queryClient = getQueryClient();
  const request = http({ context });

  await queryClient.prefetchQuery(pingQuery(request));

  const ping = await request<PingResult>('ping');
  const pong = await request<PingResult>('pong');

  return {
    message: env.VALUE_FROM_CLOUDFLARE ?? '',
    title: getInstance(context).t('demo'),
    dehydratedState: dehydrate(queryClient),
    ping,
    pong,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { message, ping, pong, dehydratedState } = loaderData;

  return (
    <div className="flex flex-col gap-10 py-8">
      <I18nDemoSection />
      <PreferencesDemoSection />
      <ApiDemoSection ping={ping} pong={pong} dehydratedState={dehydratedState} />
      <ButtonGallerySection />

      <p className="text-xs text-fg-placeholder">
        VALUE_FROM_CLOUDFLARE:
        {' '}
        {message || '(unset)'}
      </p>
    </div>
  );
}
