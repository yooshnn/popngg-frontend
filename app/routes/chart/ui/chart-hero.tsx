import type { ChartDetail, ChartSummary } from '../model/types';
import { useTranslation } from 'react-i18next';
import { useTitles } from '~/shared/preferences';
import { ChartDifficultyNav } from './chart-difficulty-nav';

export function ChartHero({
  chart,
  selectedChart,
}: {
  chart: ChartDetail;
  selectedChart: ChartSummary;
}) {
  const { t } = useTranslation();
  const { primary, secondary } = useTitles({ title: chart.title, genre: chart.genre });
  const versionNames = t('version', { returnObjects: true });
  const selectedDifficulty = selectedChart.difficulty;

  return (
    <header aria-labelledby="chart-title">
      <div className="-mx-4 px-4 pb-5 sm:-mx-5 sm:px-5 md:mx-0 md:px-6 md:py-7">
        <div className="relative grid gap-5 md:grid-cols-[15.25rem_minmax(0,1fr)] md:items-center md:gap-7">
          <div className="relative -mx-4 overflow-hidden px-4 py-5 sm:-mx-5 sm:px-5 md:mx-0 md:overflow-visible md:p-0">
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full scale-110 object-cover opacity-30 blur-2xl saturate-50 md:hidden"
              src={chart.bannerUrl}
            />
            <img
              alt={chart.title}
              className="relative block aspect-244/58 rounded-sm object-cover"
              src={chart.bannerUrl}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-fg-neutral-muted">
              <span className="rounded border border-stroke-neutral-weak px-1.5 py-0.5">
                {versionNames[chart.version]}
              </span>
              {chart.isUpper && (
                <span className="rounded bg-bg-brand-solid px-1.5 py-0.5 text-white">
                  UPPER
                </span>
              )}
            </div>

            <h1 className="mt-3 break-words text-2xl leading-tight font-bold tracking-[-.04em] md:text-3xl" id="chart-title">
              {primary}
            </h1>
            <p className="mt-1 truncate text-sm text-fg-neutral-muted md:text-base">{secondary}</p>
            <p className="mt-3 truncate text-xs text-fg-neutral-subtle md:text-sm">
              {chart.artist}
            </p>
          </div>
        </div>
      </div>

      <div className="border-y border-stroke-neutral-subtle py-3 md:px-6">
        <ChartDifficultyNav
          charts={chart.charts}
          selectedDifficulty={selectedDifficulty}
          songHash={chart.songHash}
        />
      </div>
    </header>
  );
}
