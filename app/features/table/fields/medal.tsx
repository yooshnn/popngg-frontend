import type { FormFieldRenderProps } from '../engine/form/field-config';
import type { GroupedSelectionFieldDefinition } from './selection';
import type { ClearType, Medal } from '~/entities/medal';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { clearType, medal } from '~/entities/medal';
import { Button } from '~/shared/ui/button';
import { Checkbox } from '~/shared/ui/checkbox';
import { Field, FieldLabel } from '~/shared/ui/field';
import { selectionBinding } from '../engine/core/url-binding';
import { groupToggleClassName, memberCheckboxClassName } from './inputs/group-styles';
import { canonicalizeSelection, toggleGroup, toggleSelection } from './selection';

/**
 * A gold star toggles with full combo here, not with the clear type it
 * carries. Which medals share a toggle is a filter decision rather than a
 * property of the medal, so it lives here; a group left empty drops out.
 */
const REGROUPED: Partial<Record<Medal, ClearType>> = { 'gold-star': 'full-combo' };

const GROUPS = clearType.all
  .map(id => ({
    id,
    members: medal.all.filter(item => (REGROUPED[item] ?? clearType.of(item)) === id),
  }))
  .filter(group => group.members.length > 0);

function MedalInput({ field }: FormFieldRenderProps<readonly Medal[]>) {
  const { t } = useTranslation();
  const selected = field.value;

  return (
    <Field>
      <FieldLabel variant="label">{t('tableForm.medal')}</FieldLabel>
      <div className="space-y-1">
        {GROUPS.map(group => (
          <div
            className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-x-2"
            key={group.id}
          >
            <Button
              aria-pressed={group.members.every(item => selected.includes(item))}
              className={groupToggleClassName}
              size="sm"
              variant="neutral-ghost"
              onClick={() => field.onChange(
                toggleGroup(selected, group.members, medal.all),
              )}
            >
              {t(clearType.labelKey(group.id))}
            </Button>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {group.members.map(item => (
                <Checkbox
                  checked={selected.includes(item)}
                  checkedColor={medal.color(item)}
                  className={memberCheckboxClassName}
                  key={item}
                  onCheckedChange={() => field.onChange(
                    toggleSelection(selected, item, medal.all),
                  )}
                >
                  {t(medal.labelKey(item))}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Field>
  );
}

export const medalField: GroupedSelectionFieldDefinition<ClearType, Medal> = {
  binding: selectionBinding('medal', medal),
  defaultValue: medal.all,
  schema: z.array(z.enum(medal.all)).readonly(),
  toDraft: value => value ?? medal.all,
  toApplied: draft => canonicalizeSelection(draft, medal.all),
  options: medal.all,
  groups: GROUPS,
  render: props => <MedalInput {...props} />,
};
