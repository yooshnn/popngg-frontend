import type { UrlValues } from '../core/use-url-state';
import type { FormConfig, FormDraftValues, FormValues } from './use-table-form';
import { writeBinding } from '../core/url-binding';
import { readAppliedValue } from './field-config';

export function readFormValues(
  config: FormConfig | undefined,
  values: UrlValues,
): FormValues<FormConfig> {
  return Object.fromEntries(
    Object.entries(config ?? {}).map(([key, field]) => [
      key,
      readAppliedValue(field, field.binding.read(values)),
    ]),
  );
}

export function serializeFormValues(
  config: FormConfig | undefined,
  values: FormValues<FormConfig>,
) {
  const params = new URLSearchParams();

  for (const [key, field] of Object.entries(config ?? {}))
    writeBinding(params, field.binding, values[key]);

  return params.toString();
}

export function writeFormValues(
  config: FormConfig | undefined,
  values: FormValues<FormConfig>,
): UrlValues {
  return Object.entries(config ?? {}).reduce<UrlValues>(
    (updates, [key, field]) => {
      Object.assign(updates, field.binding.write(values[key]));
      return updates;
    },
    {},
  );
}

export function clearFormValues(config: FormConfig | undefined): UrlValues {
  return Object.entries(config ?? {}).reduce<UrlValues>(
    (updates, [, field]) => {
      Object.assign(updates, field.binding.write(undefined));
      return updates;
    },
    {},
  );
}

export function getEmptyDraftValues(
  config: FormConfig | undefined,
): FormDraftValues<FormConfig> {
  return Object.fromEntries(
    Object.entries(config ?? {}).map(([key, field]) => [key, field.defaultValue]),
  );
}

export function toFormDraftValues(
  config: FormConfig | undefined,
  values: FormValues<FormConfig>,
): FormDraftValues<FormConfig> {
  return Object.fromEntries(
    Object.entries(config ?? {}).map(([key, field]) => [
      key,
      values[key] === undefined ? field.defaultValue : field.toDraft(values[key]),
    ]),
  );
}

export function toFormAppliedValues(
  config: FormConfig | undefined,
  values: FormDraftValues<FormConfig>,
): FormValues<FormConfig> {
  return Object.fromEntries(
    Object.entries(config ?? {}).map(([key, field]) => [
      key,
      field.toApplied(values[key]),
    ]),
  );
}

export function validateFormDraftValues(
  config: FormConfig | undefined,
  values: FormDraftValues<FormConfig>,
): FormDraftValues<FormConfig> {
  const validatedValues: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(config ?? {})) {
    const result = field.draftSchema.safeParse(values[key]);

    if (!result.success)
      throw result.error;

    validatedValues[key] = result.data;
  }

  return validatedValues as FormDraftValues<FormConfig>;
}
