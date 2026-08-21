import type { Route } from './+types/route';
import type { ProgressDetail } from './lib/progress-search-params';
import type { ProgressTableKind } from './lib/progress-table';
import type { Progress, ProgressAxis } from './model/types';
import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryState } from '~/shared/ui/data-state';
import { SectionControlBar } from '~/shared/ui/section-control-bar';
import { SectionHeader } from '~/shared/ui/section-header';
import { progressQuery } from './api/queries';
import { progressSearchParams } from './lib/progress-search-params';
import { progressTable, sortedRows } from './lib/progress-table';
import { AxisControl } from './ui/axis-control';
import { DetailControl } from './ui/detail-control';
import { ProgressTable } from './ui/progress-table';

const kinds = ['medal', 'rank'] as const satisfies readonly ProgressTableKind[];

export default function UserProgressRoute({ params }: Route.ComponentProps) {
  const { t } = useTranslation();
  const [{ by, detail }, setSearchParams] = useQueryStates(progressSearchParams);
  const progress = useQuery(progressQuery(params.userId, by));

  return (
    <section className="mt-10 md:mt-14" aria-labelledby="user-progress-title">
      <SectionHeader
        action={<DetailControl value={detail} onValueChange={detail => setSearchParams({ detail })} />}
        description={t('user.progress.description')}
        title={t('user.progress.title')}
        titleId="user-progress-title"
      />

      <SectionControlBar className="mt-7 md:mt-9">
        <AxisControl value={by} onValueChange={by => setSearchParams({ by })} />
      </SectionControlBar>

      <div className="mt-6">
        <QueryState isEmpty={data => data.rows.length === 0} query={progress}>
          {data => <ProgressTables axis={by} data={data} detail={detail} />}
        </QueryState>
      </div>
    </section>
  );
}

function ProgressTables({
  axis,
  data,
  detail,
}: {
  axis: ProgressAxis;
  data: Progress;
  detail: ProgressDetail;
}) {
  const tables = useMemo(
    () => ({
      medal: progressTable('medal', detail),
      rank: progressTable('rank', detail),
    }),
    [detail],
  );

  const rows = useMemo(() => sortedRows(data.rows), [data.rows]);

  return (
    <div className="space-y-10 md:space-y-12">
      {kinds.map(kind => (
        <ProgressTable
          axis={axis}
          detail={detail}
          key={kind}
          kind={kind}
          rows={rows}
          summary={data.summary}
          table={tables[kind]}
        />
      ))}
    </div>
  );
}
