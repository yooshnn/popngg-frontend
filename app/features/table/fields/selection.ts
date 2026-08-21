import type { TableFormFieldDefinition } from '../engine/form/field-config';

/** One named subset of an entity, toggled as a unit. */
export interface SelectionGroup<TId extends string, TValue extends string> {
  id: TId;
  members: readonly TValue[];
}

/**
 * Reduces a selection to entity order, treating a full or empty selection as
 * absent so it matches the binding's canonical form.
 */
export function canonicalizeSelection<TValue>(
  selected: readonly TValue[],
  all: readonly TValue[],
): readonly TValue[] | undefined {
  const values = new Set(selected);
  const selection = all.filter(value => values.has(value));

  return selection.length === 0 || selection.length === all.length
    ? undefined
    : selection;
}

export function toggleSelection<TValue>(
  selected: readonly TValue[],
  value: TValue,
  all: readonly TValue[],
): readonly TValue[] {
  const values = new Set(selected);

  if (!values.delete(value))
    values.add(value);

  return all.filter(item => values.has(item));
}

/** Selects every member of a group unless the group is already complete. */
export function toggleGroup<TValue>(
  selected: readonly TValue[],
  members: readonly TValue[],
  all: readonly TValue[],
): readonly TValue[] {
  const values = new Set(selected);
  const complete = members.every(member => values.has(member));

  for (const member of members) {
    if (complete)
      values.delete(member);
    else
      values.add(member);
  }

  return all.filter(item => values.has(item));
}

export interface SelectionFieldDefinition<TValue extends string>
  extends TableFormFieldDefinition<readonly TValue[], readonly TValue[]> {
  options: readonly TValue[];
}

export interface GroupedSelectionFieldDefinition<
  TId extends string,
  TValue extends string,
> extends SelectionFieldDefinition<TValue> {
  groups: readonly SelectionGroup<TId, TValue>[];
}
