import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LevelStepperProps {
  canGoDown: boolean;
  canGoUp: boolean;
  level: number;
  onDown: () => void;
  onUp: () => void;
}

const buttonClassName = 'flex h-full w-8 items-center justify-center text-fg-neutral-muted transition-colors hover:bg-bg-neutral-weak hover:text-fg-neutral focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring disabled:pointer-events-none disabled:text-fg-disabled';

export function LevelStepper({
  canGoDown,
  canGoUp,
  level,
  onDown,
  onUp,
}: LevelStepperProps) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex h-9 shrink-0 items-center overflow-hidden rounded-md border border-stroke-neutral-weak bg-bg-layer-default">
      <button aria-label={t('user.home.levelStats.level.previous')} className={buttonClassName} disabled={!canGoDown} type="button" onClick={onDown}>
        <ChevronLeftIcon aria-hidden="true" className="size-4" />
      </button>
      <span aria-live="polite" className="flex min-w-14 items-center justify-center self-stretch border-x border-stroke-neutral-weak px-2 text-sm font-semibold">
        {level}
        <span className="ml-0.5 text-[.625rem] font-normal text-fg-neutral-subtle">Lv</span>
      </span>
      <button aria-label={t('user.home.levelStats.level.next')} className={buttonClassName} disabled={!canGoUp} type="button" onClick={onUp}>
        <ChevronRightIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
