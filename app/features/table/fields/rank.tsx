import type { FormFieldRenderProps } from '../engine/form/field-config';
import type { GroupedSelectionFieldDefinition } from './selection';
import type { Rank, RankFamily } from '~/entities/rank';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { rank, rankFamily } from '~/entities/rank';
import { Button } from '~/shared/ui/button';
import { Checkbox } from '~/shared/ui/checkbox';
import { Field, FieldLabel } from '~/shared/ui/field';
import { selectionBinding } from '../engine/core/url-binding';
import { groupToggleClassName, memberCheckboxClassName } from './inputs/group-styles';
import { canonicalizeSelection, toggleGroup, toggleSelection } from './selection';

/**
 * AAA toggles with 90+ and the A family with 72+ here, not with the families
 * they carry. Which ranks share a toggle is a filter decision rather than a
 * property of the rank, so it lives here; a family left empty drops out.
 */
const REGROUPED: Partial<Record<RankFamily, RankFamily>> = { AAA: 'AA', A: 'B' };

const GROUPS = rankFamily.all
  .map(id => ({
    id,
    members: rank.all.filter((item) => {
      const family = rankFamily.of(item);

      return (REGROUPED[family] ?? family) === id;
    }),
  }))
  .filter(group => group.members.length > 0);

function RankInput({ field }: FormFieldRenderProps<readonly Rank[]>) {
  const { t } = useTranslation();
  const selected = field.value;

  return (
    <Field>
      <FieldLabel variant="label">{t('tableForm.rank')}</FieldLabel>
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
                toggleGroup(selected, group.members, rank.all),
              )}
            >
              {rankFamily.scoreLabel(group.id)}
            </Button>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {group.members.map(item => (
                <Checkbox
                  checked={selected.includes(item)}
                  checkedColor={rank.color(item)}
                  className={memberCheckboxClassName}
                  key={item}
                  onCheckedChange={() => field.onChange(
                    toggleSelection(selected, item, rank.all),
                  )}
                >
                  {t(rank.labelKey(item))}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Field>
  );
}

export const rankField: GroupedSelectionFieldDefinition<RankFamily, Rank> = {
  binding: selectionBinding('rank', rank),
  defaultValue: rank.all,
  schema: z.array(z.enum(rank.all)).readonly(),
  toDraft: value => value ?? rank.all,
  toApplied: draft => canonicalizeSelection(draft, rank.all),
  options: rank.all,
  groups: GROUPS,
  render: props => <RankInput {...props} />,
};
