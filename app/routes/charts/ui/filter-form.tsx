import type { Control } from 'react-hook-form';
import type { ChartsFormValues } from '../model/table';
import { useTranslation } from 'react-i18next';
import { bindTableFormField, FormSection } from '~/features/table';
import { tableConfig } from '../model/table';

const Field = bindTableFormField(tableConfig.form);

export function FilterForm({ control }: { control: Control<ChartsFormValues> }) {
  const { t } = useTranslation();

  return (
    <FormSection title={t('charts.filter.chartInfo')}>
      <Field control={control} name="version" />
      <Field control={control} name="level" />
      <Field control={control} name="difficulty" />
    </FormSection>
  );
}
