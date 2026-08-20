import type { Route } from './+types/route';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '~/shared/api';
import { ServerApiContext } from '~/shared/api/middleware.server';
import { currentPopnClassTargetsQuery, levelStatsQuery } from './api/queries';
import { LevelStatsSection } from './ui/level-stats-section';
import { PopnClassTargetSection } from './ui/popn-class-target-section';

export async function loader({ context, params }: Route.LoaderArgs) {
  const queryClient = getQueryClient();
  const request = context.get(ServerApiContext);

  await Promise.all([
    queryClient.prefetchQuery(currentPopnClassTargetsQuery(params.userId, request)),
    queryClient.prefetchQuery(levelStatsQuery(params.userId, request)),
  ]);

  return { dehydratedState: dehydrate(queryClient) };
}

export default function UserHomeRoute({ loaderData, params }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <PopnClassTargetSection userId={params.userId} />
      <LevelStatsSection userId={params.userId} />
    </HydrationBoundary>
  );
}
