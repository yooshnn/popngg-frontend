import type { UrlRange } from '../engine/core/url-binding';
import type { FormFieldRenderProps } from '../engine/form/field-config';
import type { RangeFieldDefinition } from './range';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  getRangeValidationIssue,
  rangeBinding,
} from '../engine/core/url-binding';
import { RangeFieldLayout } from './inputs/range-field-layout';
import { SelectInput } from './inputs/select-input';
import { compactRange } from './range';

const BOUNDS = { min: 1, max: 50 };

/** Levels read high to low, the order players scan a difficulty list in. */
const OPTIONS = Array.from(
  { length: BOUNDS.max - BOUNDS.min + 1 },
  (_, index) => BOUNDS.max - index,
).map(level => ({ label: String(level), value: level }));

function LevelInput({ error, field }: FormFieldRenderProps<UrlRange>) {
  const { t } = useTranslation();
  const value = field.value ?? {};

  return (
    <RangeFieldLayout error={error} label={t('tableForm.level')}>
      <SelectInput
        emptyLabel={t('tableForm.noLimit')}
        label={t('tableForm.minimum')}
        name={`${field.name}.min`}
        options={OPTIONS}
        value={value.min}
        onBlur={field.onBlur}
        onChange={min => field.onChange(compactRange({ ...value, min }) ?? {})}
      />
      <SelectInput
        emptyLabel={t('tableForm.noLimit')}
        label={t('tableForm.maximum')}
        name={`${field.name}.max`}
        options={OPTIONS}
        value={value.max}
        onBlur={field.onBlur}
        onChange={max => field.onChange(compactRange({ ...value, max }) ?? {})}
      />
    </RangeFieldLayout>
  );
}

export const levelField: RangeFieldDefinition = {
  binding: rangeBinding('levelMin', 'levelMax', BOUNDS),
  defaultValue: {},
  schema: z
    .object({ min: z.number().optional(), max: z.number().optional() })
    .check((ctx) => {
      const issue = getRangeValidationIssue(ctx.value, BOUNDS);

      if (!issue)
        return;

      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        message: issue === 'reversed'
          ? 'tableForm.error.level.reversed'
          : 'tableForm.error.level.range',
        params: BOUNDS,
      });
    }),
  toDraft: value => value ?? {},
  toApplied: compactRange,
  ...BOUNDS,
  render: props => <LevelInput {...props} />,
};
