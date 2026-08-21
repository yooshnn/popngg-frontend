import type { UserRecord } from '../model/types';
import { Link } from 'react-router';
import { difficulty } from '~/entities/difficulty';
import { MedalIcon } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';
import { RankIcon } from '~/entities/rank';
import { score } from '~/entities/score';
import { useTitles } from '~/shared/preferences';

export function ListItem({ record }: { record: UserRecord }) {
  const { primary, secondary } = useTitles(record);
  const difficultyColor = difficulty.color(record.difficulty);

  return (
    <li className="relative flex min-w-0 flex-col gap-y-2 py-3 md:flex-row md:items-center md:gap-x-3 md:py-2.5">
      <Link className="block shrink-0" to={`/chart/${record.id}/${record.difficulty}`}>
        <img
          alt={record.title}
          className="block h-auto w-61 rounded-sm"
          loading="lazy"
          src={record.bannerUrl}
        />
      </Link>

      <div className="relative flex min-h-12 min-w-0 flex-1 items-center md:min-h-0">
        <div className="min-w-0 flex-1 pr-2">
          <span className="flex min-w-0 items-center gap-1.5">
            <span
              className="inline-flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[11px] font-bold tabular-nums text-white"
              style={{ backgroundColor: difficultyColor }}
            >
              {difficulty.shortLabel(record.difficulty)}
              {' '}
              {record.level}
            </span>
            <span className="truncate text-sm font-medium text-fg-neutral">{primary}</span>
          </span>
          <span className="mt-1 block truncate text-xs text-fg-neutral-subtle">{secondary}</span>
        </div>

        <span className="absolute top-1/2 right-0 flex -translate-y-1/2 flex-col items-end gap-y-1 bg-linear-to-r from-transparent via-bg-layer-default/95 via-10% to-bg-layer-default md:flex-row md:items-center md:gap-y-0 md:p-3">
          <span className="flex items-center">
            <MedalIcon className="mr-1" medal={record.medal} />
            <span className="w-1" />
            <RankIcon className="md:mr-2" rank={record.rank} />
          </span>
          <div className="flex items-center">
            <span className="w-18 pr-1.5 text-right text-sm font-semibold tabular-nums text-fg-neutral">
              {score.format(record.score)}
            </span>
            <span className="mt-1 text-[10px] font-normal tabular-nums text-fg-neutral-muted">
              /
              <span className="pl-0.5">{popnClass.format(record.popnClass)}</span>
            </span>
          </div>
        </span>
      </div>
    </li>
  );
}
