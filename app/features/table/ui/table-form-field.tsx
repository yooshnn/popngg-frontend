import type { Control, FieldPathValue, Path } from 'react-hook-form';
import type { $ZodIssue } from 'zod/v4/core';
import type {
  FormConfig,
  RenderableFormKey,
  TableFormFieldDefinition,
} from '../engine/form/field-config';

import type { FormDraftValues } from '../engine/form/use-table-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Translate = ReturnType<typeof useTranslation>['t'];

/** Translates a key only known at runtime, outside the typed key space. */
type DynamicTranslate = (
  key: string,
  values?: Record<string, unknown>,
) => string;

/** Resolves a draft schema issue, whose message carries a translation key. */
function translateIssue(t: Translate, issue: $ZodIssue | undefined): string {
  if (!issue)
    return t('dataTable.filter.invalidValue');

  const values = issue.code === 'custom' ? issue.params : undefined;

  return (t as unknown as DynamicTranslate)(issue.message, values);
}

interface TableFormFieldProps<
  F extends FormConfig,
  K extends RenderableFormKey<F> & Path<FormDraftValues<F>>,
> {
  control: Control<FormDraftValues<F>>;
  form: F & Record<
    K,
    TableFormFieldDefinition<any, FieldPathValue<FormDraftValues<F>, K>>
  >;
  name: K;
}

/** Connects one reusable field definition to React Hook Form. */
export function TableFormField<
  F extends FormConfig,
  K extends RenderableFormKey<F> & Path<FormDraftValues<F>>,
>({ control, form, name }: TableFormFieldProps<F, K>) {
  const { t } = useTranslation();
  const definition = form[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          const result = definition.schema.safeParse(value);

          return result.success || translateIssue(t, result.error.issues[0]);
        },
      }}
      render={({ field, fieldState }) =>
        definition.render({
          error: fieldState.error?.message,
          field: {
            value: field.value,
            onChange: value => field.onChange(value),
            onBlur: field.onBlur,
            name: field.name,
            ref: instance => field.ref(instance),
          },
        })}
    />
  );
}

interface BoundTableFormFieldProps<F extends FormConfig, K> {
  control: Control<FormDraftValues<F>>;
  name: K;
}

/**
 * Binds one form config to a field component, leaving only control and name.
 *
 * The cast re-states what the caller's `name` already proves: a key surviving
 * `RenderableFormKey` names a definition whose draft is that key's draft. The
 * relation holds per key, which a component generic over every key cannot say.
 */
export function bindTableFormField<F extends FormConfig>(form: F) {
  return function BoundTableFormField<
    K extends RenderableFormKey<F> & Path<FormDraftValues<F>>,
  >({ control, name }: BoundTableFormFieldProps<F, K>) {
    return (
      <TableFormField
        control={control}
        form={form as Parameters<typeof TableFormField<F, K>>[0]['form']}
        name={name}
      />
    );
  };
}
