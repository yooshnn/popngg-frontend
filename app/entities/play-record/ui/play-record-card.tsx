import type { Difficulty } from '~/entities/difficulty';
import type { Medal } from '~/entities/medal';
import type { PopnClass } from '~/entities/popn-class';
import type { Rank } from '~/entities/rank';
import type { Score } from '~/entities/score';
import { Link } from 'react-router';
import { difficulty } from '~/entities/difficulty';
import { clearType, MedalIcon } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';
import { RankIcon } from '~/entities/rank';
import { score } from '~/entities/score';
import { useTitles } from '~/shared/preferences';

export interface PlayRecordCardData {
  id: string;
  title: string;
  genre: string;
  bannerUrl: string;
  difficulty: Difficulty;
  level: number;
  medal: Medal;
  rank: Rank;
  score: Score;
  popnClass: PopnClass;
}

export interface PlayRecordCardProps {
  data: PlayRecordCardData;
}

/** Displays a chart and its play record using the shared product card layout. */
export function PlayRecordCard({ data }: PlayRecordCardProps) {
  const { primary } = useTitles(data);
  const medalColor = clearType.color(clearType.of(data.medal));
  const difficultyColor = difficulty.color(data.difficulty);

  return (
    <li
      className="relative min-w-0 overflow-hidden border bg-bg-layer-default"
      style={{ borderColor: medalColor }}
    >
      <SongBanner alt={data.title} src={data.bannerUrl} to={`/chart/${data.id}/${data.difficulty}`} />

      <div
        className="flex h-6 items-center justify-between text-[11px] leading-none"
        style={{ backgroundColor: `${difficultyColor}25` }}
      >
        <span
          className="flex h-full items-center px-2 font-bold tabular-nums text-white"
          style={{ backgroundColor: difficultyColor }}
        >
          {difficulty.shortLabel(data.difficulty)}
          {' '}
          {data.level}
        </span>
        <span className="min-w-0 flex-1 truncate px-2 text-right">
          {primary}
        </span>
      </div>

      <div className="flex h-10 items-center justify-between gap-2 px-2 text-[13px] leading-none">
        <span className="min-w-0 truncate text-[11px] font-normal tabular-nums text-fg-neutral-subtle">
          {popnClass.format(data.popnClass)}
        </span>
        <span className="flex shrink-0 items-center">
          <MedalIcon medal={data.medal} />
          <span className="w-1.5" />
          <RankIcon rank={data.rank} />
          <span className="w-2" />
          <span className="font-semibold tabular-nums">
            {score.format(data.score)}
          </span>
        </span>
      </div>
    </li>
  );
}

function SongBanner({ alt, src, to }: { alt: string; src: string; to: string }) {
  return (
    <Link className="relative block aspect-244/58 max-h-14.5 w-full overflow-hidden" to={to}>
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-lg saturate-50"
        loading="lazy"
        src={src}
      />
      <img
        alt={alt}
        className="relative mx-auto block h-full w-auto max-w-full scale-[1.01]"
        loading="lazy"
        src={src}
      />
    </Link>
  );
}
