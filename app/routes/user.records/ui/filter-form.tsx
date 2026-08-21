import type { Control } from 'react-hook-form';
import type { RecordsFormValues } from '../model/table';
import { useTranslation } from 'react-i18next';
import { bindTableFormField, FormSection } from '~/features/table';
import { tableConfig } from '../model/table';

const Field = bindTableFormField(tableConfig.form);

export function FilterForm({ control }: { control: Control<RecordsFormValues> }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-7">
      <FormSection title={t('user.records.filter.chartInfo')}>
        <Field control={control} name="version" />
        <Field control={control} name="level" />
        <Field control={control} name="difficulty" />
      </FormSection>

      <FormSection title={t('user.records.filter.playInfo')}>
        <Field control={control} name="medal" />
        <Field control={control} name="rank" />
        <Field control={control} name="score" />
      </FormSection>
    </div>
  );
}
