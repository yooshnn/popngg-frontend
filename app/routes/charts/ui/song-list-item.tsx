import type { ChartSummary, SongSummary } from '../model/types';
import type { Difficulty } from '~/entities/difficulty';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { difficulty } from '~/entities/difficulty';
import { useTitles } from '~/shared/preferences';

export function SongListItem({ song }: { song: SongSummary }) {
  const { t } = useTranslation();
  const { primary, secondary } = useTitles({ title: song.title, genre: song.genre });
  const versionNames = t('version', { returnObjects: true });
  const highestChart = highestDifficultyChart(song.charts);

  return (
    <li className="flex min-w-0 flex-col gap-y-2 py-3 md:py-2.5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-fg-neutral-muted">
        <span className="rounded border border-stroke-neutral-weak px-1.5 py-0.5">
          {versionNames[song.version]}
        </span>
        {song.isUpper && (
          <span className="rounded bg-bg-brand-solid px-1.5 py-0.5 text-white">
            UPPER
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3">
        {highestChart
          ? (
              <Link className="block shrink-0 rounded-sm" to={`/chart/${song.songHash}/${highestChart.difficulty}`}>
                <img
                  alt={song.title}
                  className="block h-auto w-61 rounded-sm"
                  loading="lazy"
                  src={song.bannerUrl}
                />
              </Link>
            )
          : (
              <img
                alt={song.title}
                className="block h-auto w-61 shrink-0 rounded-sm"
                loading="lazy"
                src={song.bannerUrl}
              />
            )}

        <div className="flex min-h-12 min-w-0 flex-1 items-center gap-x-3 md:min-h-0">
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-fg-neutral">{primary}</span>
            <span className="mt-1 block truncate text-xs text-fg-neutral-subtle">{secondary}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 md:justify-end">
            {difficulty.all.map((item) => {
              const chart = song.charts.find(candidate => candidate.difficulty === item);
              return chart
                ? <DifficultyLink chart={chart} key={item} songHash={song.songHash} />
                : <EmptyDifficultySlot difficultyValue={item} key={item} />;
            })}
          </div>
        </div>
      </div>
    </li>
  );
}

function highestDifficultyChart(charts: ChartSummary[]): ChartSummary | undefined {
  for (const value of [...difficulty.all].reverse()) {
    const chart = charts.find(candidate => candidate.difficulty === value);
    if (chart) {
      return chart;
    }
  }

  return undefined;
}

function DifficultyLink({
  chart,
  songHash,
}: {
  chart: ChartSummary;
  songHash: string;
}) {
  const color = difficulty.color(chart.difficulty);

  return (
    <Link
      className="flex flex-col items-center rounded-md px-1 py-1 transition-colors hover:bg-bg-neutral-weak"
      title={difficulty.label(chart.difficulty)}
      to={`/chart/${songHash}/${chart.difficulty}`}
    >
      <div className="hidden flex-col items-center md:flex">
        <span className="w-9 text-center text-[10px] leading-none font-bold" style={{ color }}>
          {difficulty.shortLabel(chart.difficulty)}
        </span>
        <span className="mt-1 w-9 text-center text-sm leading-none font-semibold tabular-nums text-fg-neutral">
          {chart.level}
        </span>
        <span className="mt-1 h-1 w-9 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="flex items-center md:hidden rounded text-white" style={{ backgroundColor: color }}>
        <span
          className="inline-flex h-5 w-11 shrink-0 items-center justify-center rounded px-1.5 text-[11px] font-bold tabular-nums text-white"
          style={{ backgroundColor: color }}
        >
          {difficulty.shortLabel(chart.difficulty)}
          {' '}
          {chart.level}
        </span>
      </div>
    </Link>
  );
}

function EmptyDifficultySlot({
  difficultyValue,
}: {
  difficultyValue: Difficulty;
}) {
  return (
    <span
      className="flex flex-col items-center rounded-md px-1 py-1"
      title={`${difficulty.label(difficultyValue)} —`}
    >
      <span className="hidden flex-col items-center md:flex">
        <span className="w-9 text-center text-[10px] leading-none font-bold text-fg-disabled">
          {difficulty.shortLabel(difficultyValue)}
        </span>
        <span className="mt-1 w-9 text-center text-sm leading-none font-semibold tabular-nums text-fg-disabled">
          -
        </span>
        <span
          className="mt-1 h-1 w-9 rounded-full opacity-20"
          style={{ backgroundColor: difficulty.color(difficultyValue) }}
        />
      </span>
      <span className="inline-flex h-5 w-11 shrink-0 items-center justify-center rounded bg-bg-neutral-weak px-1.5 text-[11px] font-bold tabular-nums text-fg-disabled md:hidden">
        {difficulty.shortLabel(difficultyValue)}
        {' '}
        -
      </span>
    </span>
  );
}
