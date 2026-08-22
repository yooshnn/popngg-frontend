import type { Route } from './+types/route';
import type { LevelStats } from './model/types';
import { useQuery } from '@tanstack/react-query';
import { levelStatsQuery } from './api/queries';
import { EmptyHome } from './ui/empty-home';
import { LevelStatsSection } from './ui/level-stats-section';
import { PopnClassTargetSection } from './ui/popn-class-target-section';

export default function UserHomeRoute({ params }: Route.ComponentProps) {
  const stats = useQuery(levelStatsQuery(params.userId));

  // Undefined during loading/error: those states are each section's own QueryState to handle,
  // not this gate's — deciding here too would double up on the skeleton/retry UI.
  if (stats.data && !hasRecords(stats.data)) {
    return <EmptyHome />;
  }

  return (
    <>
      <PopnClassTargetSection userId={params.userId} />
      <LevelStatsSection userId={params.userId} />
    </>
  );
}

function hasRecords(stats: LevelStats[]): boolean {
  return stats.some(item => item.total > 0);
}
