import type { Route } from './+types/route';
import type { Difficulty } from '~/entities/difficulty';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { isHTTPError } from 'ky';
import { data } from 'react-router';
import { difficulty } from '~/entities/difficulty';
import { getQueryClient } from '~/shared/api';
import { ServerApiContext } from '~/shared/api/middleware.server';
import { getInstance } from '~/shared/i18n/middleware.server';
import { containerStyles } from '~/shared/ui/container';
import { chartDetailQuery } from './api/queries';
import { ChartDetailLayout } from './ui/chart-detail-layout';

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData
    ? [{ title: `${loaderData.title} · ${difficulty.label(loaderData.difficulty)} ${loaderData.level}` }]
    : [];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const selectedDifficulty = readDifficulty(params.difficulty, context);
  const queryClient = getQueryClient();
  const request = context.get(ServerApiContext);

  try {
    const chart = await queryClient.fetchQuery(chartDetailQuery(params.songHash, request));
    const selectedChart = chart.charts.find(item => item.difficulty === selectedDifficulty);

    if (!selectedChart) {
      throw notFound(context);
    }

    return {
      dehydratedState: dehydrate(queryClient),
      difficulty: selectedDifficulty,
      level: selectedChart.level,
      title: chart.title,
    };
  }
  catch (error) {
    if (isHTTPError(error) && error.response.status === 404) {
      throw notFound(context);
    }
    throw error;
  }
}

export default function ChartRoute({ loaderData, params }: Route.ComponentProps) {
  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <HydrationBoundary state={loaderData.dehydratedState}>
        <ChartDetailLayout difficulty={loaderData.difficulty} songHash={params.songHash} />
      </HydrationBoundary>
    </main>
  );
}

function readDifficulty(value: string | undefined, context: Route.LoaderArgs['context']): Difficulty {
  if (value && difficulty.all.includes(value as Difficulty)) {
    return value as Difficulty;
  }

  throw notFound(context);
}

function notFound(context: Route.LoaderArgs['context']) {
  return data({ title: getInstance(context).t('notFound.title') }, { status: 404 });
}
