import type { FormFieldRenderProps } from '../engine/form/field-config';
import type { SelectionFieldDefinition } from './selection';
import type { Difficulty } from '~/entities/difficulty';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { difficulty } from '~/entities/difficulty';
import { Checkbox } from '~/shared/ui/checkbox';
import { Field, FieldLabel } from '~/shared/ui/field';
import { selectionBinding } from '../engine/core/url-binding';
import { canonicalizeSelection, toggleSelection } from './selection';

function DifficultyInput({ field }: FormFieldRenderProps<readonly Difficulty[]>) {
  const { t } = useTranslation();
  const selected = field.value;

  return (
    <Field>
      <FieldLabel variant="label">{t('tableForm.difficulty')}</FieldLabel>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {difficulty.all.map(item => (
          <Checkbox
            checked={selected.includes(item)}
            checkedColor={difficulty.color(item)}
            className="text-xs"
            key={item}
            onCheckedChange={() => field.onChange(
              toggleSelection(selected, item, difficulty.all),
            )}
          >
            {difficulty.label(item)}
          </Checkbox>
        ))}
      </div>
    </Field>
  );
}

export const difficultyField: SelectionFieldDefinition<Difficulty> = {
  binding: selectionBinding('difficulty', difficulty),
  defaultValue: difficulty.all,
  schema: z.array(z.enum(difficulty.all)).readonly(),
  toDraft: value => value ?? difficulty.all,
  toApplied: draft => canonicalizeSelection(draft, difficulty.all),
  options: difficulty.all,
  render: props => <DifficultyInput {...props} />,
};
