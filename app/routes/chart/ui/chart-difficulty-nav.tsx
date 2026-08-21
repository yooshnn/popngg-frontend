import type { ChartSummary } from '../model/types';
import type { Difficulty } from '~/entities/difficulty';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { difficulty } from '~/entities/difficulty';

export function ChartDifficultyNav({
  songHash,
  charts,
  selectedDifficulty,
}: {
  songHash: string;
  charts: ChartSummary[];
  selectedDifficulty: Difficulty;
}) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('chart.difficultyNavigation')} className="flex min-w-0 justify-center gap-1.5 md:justify-end">
      {difficulty.all.map((value) => {
        const chart = charts.find(item => item.difficulty === value);
        return chart
          ? <DifficultyLink chart={chart} isSelected={value === selectedDifficulty} key={value} songHash={songHash} />
          : <EmptyDifficultySlot key={value} value={value} />;
      })}
    </nav>
  );
}

function DifficultyLink({
  chart,
  isSelected,
  songHash,
}: {
  chart: ChartSummary;
  isSelected: boolean;
  songHash: string;
}) {
  const color = difficulty.color(chart.difficulty);

  return (
    <Link
      aria-current={isSelected ? 'page' : undefined}
      className={`flex min-w-12 flex-col items-center rounded-md px-1 py-1 transition-colors hover:bg-bg-neutral-weak ${isSelected ? 'bg-bg-neutral-weak text-fg-neutral' : 'text-fg-neutral-muted'}`}
      to={`/chart/${songHash}/${chart.difficulty}`}
    >
      <span className="text-[10px] leading-none font-bold" style={{ color }}>
        {difficulty.shortLabel(chart.difficulty)}
      </span>
      <span className="mt-1 text-base leading-none font-semibold tabular-nums">
        {chart.level}
      </span>
      <span className="mt-1 h-1 w-9 rounded-full" style={{ backgroundColor: color }} />
    </Link>
  );
}

function EmptyDifficultySlot({ value }: { value: Difficulty }) {
  return (
    <span className="flex min-w-12 flex-col items-center rounded-md px-1 py-1 text-fg-disabled" title={`${difficulty.label(value)} —`}>
      <span className="text-[10px] leading-none font-bold">{difficulty.shortLabel(value)}</span>
      <span className="mt-1 text-base leading-none font-semibold tabular-nums">—</span>
      <span className="mt-1 h-1 w-9 rounded-full opacity-20" style={{ backgroundColor: difficulty.color(value) }} />
    </span>
  );
}
