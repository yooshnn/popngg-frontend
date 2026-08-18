import type { Api } from '../shared/api';
import type { Route } from './+types/home';
import { dehydrate, HydrationBoundary, queryOptions, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { api, getQueryClient } from '../shared/api';
import { ServerApiContext } from '../shared/api/middleware.server';

const pingResponseSchema = z.object({
  message: z.string(),
  receivedCookie: z.boolean(),
});

function pingQuery(request: Api = api) {
  return queryOptions({
    queryKey: ['ping'],
    queryFn: () => request('ping', pingResponseSchema),
  });
}

function pongQuery(request: Api = api) {
  return queryOptions({
    queryKey: ['pong'],
    queryFn: () => request('pong', pingResponseSchema),
  });
}

export async function loader({ context }: Route.LoaderArgs) {
  const queryClient = getQueryClient();
  const request = context.get(ServerApiContext);

  await queryClient.fetchQuery(pingQuery(request));

  return { dehydratedState: dehydrate(queryClient) };
}

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <HomeContent />
    </HydrationBoundary>
  );
}

function HomeContent() {
  const { t } = useTranslation();
  const ping = useQuery(pingQuery());
  const pong = useQuery(pongQuery());

  return (
    <main>
      <h1>{t('demo')}</h1>
      <p>{ping.data?.message}</p>
      <p>{pong.data?.message}</p>
    </main>
  );
}
