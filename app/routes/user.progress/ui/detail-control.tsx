import type { ProgressDetail } from '../lib/progress-search-params';
import { useTranslation } from 'react-i18next';
import { SegmentedControl } from '~/shared/ui/segmented-control';
import { details } from '../lib/progress-search-params';

interface DetailControlProps {
  value: ProgressDetail;
  onValueChange: (value: ProgressDetail) => void;
}

export function DetailControl({ value, onValueChange }: DetailControlProps) {
  const { t } = useTranslation();

  return (
    <SegmentedControl
      aria-label={t('user.progress.detail.label')}
      options={details.map(detail => ({
        value: detail,
        label: t(`user.progress.detail.${detail}`),
      }))}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
