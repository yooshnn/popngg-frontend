import type { PopnClassTargetCalculation } from '../model/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '~/shared/ui/section-header';
import { SegmentedControl } from '~/shared/ui/segmented-control';
import { PopnClassTargetResults } from './popn-class-target-results';

const calculationOptions = [
  { value: 'current', labelKey: 'user.home.popnClassTargets.calculation.current' },
  { value: 'legacy', labelKey: 'user.home.popnClassTargets.calculation.legacy' },
] as const satisfies ReadonlyArray<{ value: PopnClassTargetCalculation; labelKey: string }>;

export function PopnClassTargetSection({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [calculation, setCalculation] = useState<PopnClassTargetCalculation>('current');

  return (
    <section className="mt-10 md:mt-14" aria-labelledby="popn-class-target-title">
      <SectionHeader
        action={(
          <SegmentedControl
            aria-label={t('user.home.popnClassTargets.calculation.label')}
            options={calculationOptions.map(option => ({
              value: option.value,
              label: t(option.labelKey),
            }))}
            value={calculation}
            onValueChange={setCalculation}
          />
        )}
        description={t('user.home.popnClassTargets.description')}
        title={t('user.home.popnClassTargets.title')}
        titleId="popn-class-target-title"
      />

      <div className="mt-7 md:mt-9">
        <PopnClassTargetResults calculation={calculation} userId={userId} />
      </div>
    </section>
  );
}
