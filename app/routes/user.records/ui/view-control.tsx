import type { View } from '../lib/view-search-params';
import { useTranslation } from 'react-i18next';
import { SegmentedControl } from '~/shared/ui/segmented-control';
import { views } from '../lib/view-search-params';

export function ViewControl({ value, onValueChange }: {
  value: View;
  onValueChange: (value: View) => void;
}) {
  const { t } = useTranslation();

  return (
    <SegmentedControl
      aria-label={t('user.records.view.label')}
      options={views.map(view => ({
        value: view,
        label: t(`user.records.view.${view}`),
      }))}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
