import type { ProgressAxis } from '../model/types';
import { useTranslation } from 'react-i18next';
import { PillGroup } from '~/shared/ui/pill-group';
import { axes } from '../model/types';

interface AxisControlProps {
  value: ProgressAxis;
  onValueChange: (value: ProgressAxis) => void;
}

export function AxisControl({ value, onValueChange }: AxisControlProps) {
  const { t } = useTranslation();

  return (
    <PillGroup
      aria-label={t('user.progress.axis.label')}
      options={axes.map(axis => ({
        value: axis,
        label: t(`user.progress.axis.${axis}`),
      }))}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
