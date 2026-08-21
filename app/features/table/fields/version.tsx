import type { FormFieldRenderProps, TableFormFieldDefinition } from '../engine/form/field-config';
import type { PopnVersion } from '~/entities/popn-version';
import { parseAsNumberLiteral } from 'nuqs';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { popnVersion } from '~/entities/popn-version';
import { singleKeyBinding } from '../engine/core/url-binding';
import { SelectInput } from './inputs/select-input';

/** The absent option of a single-select field, which owns no query value. */
export const NO_VERSION = 0;

export type VersionDraft = PopnVersion | typeof NO_VERSION;

export interface VersionFieldDefinition
  extends TableFormFieldDefinition<PopnVersion, VersionDraft> {
  options: readonly PopnVersion[];
}

function VersionInput({ field }: FormFieldRenderProps<VersionDraft>) {
  const { t } = useTranslation();
  const versionNames = t('version', { returnObjects: true });
  const options = popnVersion.all.map(version => ({
    label: versionNames[version],
    value: version,
  }));

  return (
    <SelectInput
      emptyLabel={t('tableForm.allVersions')}
      label={t('tableForm.version')}
      labelVariant="label"
      name={field.name}
      options={options}
      value={field.value || undefined}
      onBlur={field.onBlur}
      onChange={value => field.onChange(value ?? NO_VERSION)}
    />
  );
}

export const versionField: VersionFieldDefinition = {
  binding: singleKeyBinding('version', parseAsNumberLiteral(popnVersion.all)),
  defaultValue: NO_VERSION,
  schema: z.literal([...popnVersion.all, NO_VERSION]),
  toDraft: value => value ?? NO_VERSION,
  toApplied: draft => draft === NO_VERSION ? undefined : draft,
  options: popnVersion.all,
  render: props => <VersionInput {...props} />,
};
