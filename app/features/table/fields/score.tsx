import type { UrlRange } from '../engine/core/url-binding';
import type { FormFieldRenderProps } from '../engine/form/field-config';
import type { RangeFieldDefinition } from './range';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { score } from '~/entities/score';
import {
  getRangeValidationIssue,
  rangeBinding,
} from '../engine/core/url-binding';
import { NumberInput } from './inputs/number-input';
import { RangeFieldLayout } from './inputs/range-field-layout';
import { compactRange } from './range';

const BOUNDS = { min: 0, max: score.MAX };

function ScoreInput({ error, field }: FormFieldRenderProps<UrlRange>) {
  const { t } = useTranslation();
  const value = field.value ?? {};

  return (
    <RangeFieldLayout error={error} label={t('tableForm.score')}>
      <NumberInput
        label={t('tableForm.minimum')}
        max={BOUNDS.max}
        min={BOUNDS.min}
        name={`${field.name}.min`}
        placeholder={String(BOUNDS.min)}
        suffix={t('tableForm.points')}
        value={value.min}
        onBlur={field.onBlur}
        onChange={min => field.onChange(compactRange({ ...value, min }) ?? {})}
      />
      <NumberInput
        label={t('tableForm.maximum')}
        max={BOUNDS.max}
        min={BOUNDS.min}
        name={`${field.name}.max`}
        placeholder={String(BOUNDS.max)}
        suffix={t('tableForm.points')}
        value={value.max}
        onBlur={field.onBlur}
        onChange={max => field.onChange(compactRange({ ...value, max }) ?? {})}
      />
    </RangeFieldLayout>
  );
}

export const scoreField: RangeFieldDefinition = {
  binding: rangeBinding('scoreMin', 'scoreMax', BOUNDS),
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
          ? 'tableForm.error.score.reversed'
          : 'tableForm.error.score.range',
        params: BOUNDS,
      });
    }),
  toDraft: value => value ?? {},
  toApplied: compactRange,
  ...BOUNDS,
  render: props => <ScoreInput {...props} />,
};
