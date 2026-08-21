import type { Difficulty } from '~/entities/difficulty';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { chartDetailQuery } from '../api/queries';
import { ChartHero } from './chart-hero';
import { ChartNav } from './chart-nav';

export function ChartDetailLayout({
  difficulty,
  songHash,
}: {
  difficulty: Difficulty;
  songHash: string;
}) {
  const { data: chart } = useQuery(chartDetailQuery(songHash));
  const selectedChart = chart?.charts.find(item => item.difficulty === difficulty);

  if (!chart || !selectedChart) {
    return null;
  }

  return (
    <article className="py-6 md:py-12">
      <ChartHero chart={chart} selectedChart={selectedChart} />
      <ChartNav />
      <Outlet />
    </article>
  );
}
