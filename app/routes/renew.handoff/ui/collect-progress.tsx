import type { CollectPhase, CollectProgress as CollectProgressData } from '~/features/renewal';
import { CheckIcon, ChevronLastIcon, LoaderCircleIcon, MinusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/shared/ui/button';

const STEPS = ['profile', 'levels', 'newsongs', 'popnclass'] as const satisfies readonly CollectPhase[];

/** The tail of STEPS that the skip control drops — newsongs exists only to feed the popclass scan. */
const SKIPPABLE: readonly CollectPhase[] = ['newsongs', 'popnclass'];

type StepStatus = 'done' | 'active' | 'pending' | 'skipped';

function stepStatus(step: CollectPhase, index: number, currentIndex: number, skipping: boolean): StepStatus {
  if (skipping && SKIPPABLE.includes(step)) {
    return 'skipped';
  }
  if (index < currentIndex) {
    return 'done';
  }
  if (index === currentIndex) {
    return 'active';
  }
  return 'pending';
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-fg-brand" />;
  }
  if (status === 'active') {
    return <LoaderCircleIcon aria-hidden="true" className="size-4 shrink-0 animate-spin text-fg-brand" />;
  }
  if (status === 'skipped') {
    return <MinusIcon aria-hidden="true" className="size-4 shrink-0 text-fg-neutral-subtle" />;
  }
  return (
    <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
      <span className="size-1.5 rounded-full bg-fg-neutral-subtle" />
    </span>
  );
}

/**
 * Time on the popclass step, which has no bar — the scan stops at a level it cannot know
 * in advance, so elapsed time is the only honest number, and the one you judge a skip by.
 */
function Elapsed() {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(value => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return <>{t('renewal.progress.elapsed', { minutes: Math.floor(seconds / 60), seconds: seconds % 60 })}</>;
}

/**
 * Floats over the run like an ad-skip button: an offer, not a step. Once the collector has been
 * told, it leaves entirely — the struck-through step in the list is what reports the state.
 */
function SkipFloat({ skipRequested, onSkip }: { skipRequested: boolean; onSkip: (skip: boolean) => void }) {
  const { t } = useTranslation();

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {skipRequested
        ? (
            <Button
              className="text-xs text-fg-neutral-subtle"
              onClick={() => onSkip(false)}
              size="sm"
              suffixIcon={<XIcon />}
              type="button"
              variant="neutral-ghost"
            >
              {t('renewal.skip.undo')}
            </Button>
          )
        : (
            <Button
              className="rounded-full shadow-lg active:rounded-full"
              onClick={() => onSkip(true)}
              size="sm"
              suffixIcon={<ChevronLastIcon />}
              type="button"
              variant="neutral-solid"
            >
              {t('renewal.skip.action')}
            </Button>
          )}
    </div>
  );
}

function StepDetail({ phase, progress }: { phase: CollectPhase; progress: CollectProgressData }) {
  const { t } = useTranslation();

  if (phase === 'levels' && progress.records !== null) {
    return (
      <p className="mt-1 text-xs text-fg-neutral-subtle">
        {t('renewal.progress.records', { count: progress.records })}
      </p>
    );
  }

  if (phase === 'popnclass' && progress.level !== null) {
    return (
      <p className="mt-1 text-xs text-fg-neutral-subtle">
        {t('renewal.progress.scan', { level: progress.level, count: progress.details ?? 0 })}
        {' · '}
        <Elapsed />
      </p>
    );
  }

  return null;
}

export function CollectProgress({
  phase,
  progress,
  skipRequested,
  skipSettled,
  onSkip,
}: {
  phase: CollectPhase;
  progress: CollectProgressData;
  skipRequested: boolean;
  skipSettled: boolean;
  onSkip: (skip: boolean) => void;
}) {
  const { t } = useTranslation();
  const currentIndex = phase === 'done' ? STEPS.length : STEPS.indexOf(phase);
  // popnclass는 컷라인이 오를 때마다 남은 레벨 수 예상치가 바뀌고, 대부분 상위 몇 레벨 안에서
  // 끝난다 — 채워질 총량을 모르는 채로 그리는 바는 실제 진행률보다 항상 부풀려 보인다.
  // 이 단계는 바 대신 레벨/상세 수치(StepDetail)만으로 진행 중임을 알린다.
  const hasBar = progress.total > 0 && phase !== 'popnclass';
  const percent = hasBar ? Math.min(100, (progress.done / progress.total) * 100) : 0;
  const current = hasBar ? Math.min(progress.done, progress.total) : 0;
  const skipping = skipRequested || progress.skipped;
  const finished = phase === 'done';

  return (
    <div>
      <ul aria-label={t('renewal.progress.label')} aria-live="polite" className="space-y-3">
        {STEPS.map((step, index) => {
          const status = stepStatus(step, index, currentIndex, skipping);

          return (
            <li className={status === 'pending' ? 'opacity-50' : undefined} key={step}>
              <div className="flex items-center gap-2 text-sm">
                <StepIcon status={status} />
                <span
                  className={
                    status === 'skipped'
                      ? 'text-fg-neutral-subtle line-through'
                      : status === 'pending' ? 'text-fg-neutral-subtle' : 'text-fg-neutral'
                  }
                >
                  {t(`renewal.phase.${step}`)}
                </span>
                {status === 'skipped' && (
                  <span className="text-xs text-fg-neutral-subtle">{t('renewal.progress.skipped')}</span>
                )}
                {status === 'active' && hasBar && (
                  <span className="tabular-nums text-fg-neutral-muted">{` (${current}/${progress.total})`}</span>
                )}
              </div>
              {status === 'active' && (
                <>
                  {hasBar && (
                    <div
                      aria-label={t(`renewal.phase.${step}`)}
                      aria-valuemax={progress.total}
                      aria-valuemin={0}
                      aria-valuenow={current}
                      className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bg-neutral-weak"
                      role="progressbar"
                    >
                      <div
                        className="h-full rounded-full bg-bg-brand-solid transition-[width]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                  <StepDetail phase={step} progress={progress} />
                </>
              )}
            </li>
          );
        })}
      </ul>

      {!finished && !skipSettled && (
        <SkipFloat onSkip={onSkip} skipRequested={skipping} />
      )}
    </div>
  );
}
