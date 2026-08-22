import type { PopnClassTargetView } from '../model/types';
import { useQueryStates } from 'nuqs';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '~/shared/ui/section-header';
import { SegmentedControl } from '~/shared/ui/segmented-control';
import { popnClassTargetSearchParams } from '../lib/popn-class-target-search-params';
import { PopnClassTargetResults } from './popn-class-target-results';

const viewOptions = [
  { value: 'potential', labelKey: 'user.home.popnClassTargets.view.potential' },
  { value: 'actual', labelKey: 'user.home.popnClassTargets.view.actual' },
  { value: 'legacy', labelKey: 'user.home.popnClassTargets.view.legacy' },
] as const satisfies ReadonlyArray<{ value: PopnClassTargetView; labelKey: string }>;

export function PopnClassTargetSection({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [{ view }, setSearchParams] = useQueryStates(popnClassTargetSearchParams);

  return (
    <section className="mt-10 md:mt-14" aria-labelledby="popn-class-target-title">
      <SectionHeader
        action={(
          <SegmentedControl
            aria-label={t('user.home.popnClassTargets.view.label')}
            options={viewOptions.map(option => ({
              value: option.value,
              label: t(option.labelKey),
            }))}
            value={view}
            onValueChange={view => setSearchParams({ view })}
          />
        )}
        description={t('user.home.popnClassTargets.description')}
        title={t('user.home.popnClassTargets.title')}
        titleId="popn-class-target-title"
      />

      <div className="mt-7 md:mt-9">
        <PopnClassTargetResults userId={userId} view={view} />
      </div>
    </section>
  );
}
