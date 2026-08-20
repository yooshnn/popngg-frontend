import type { Control, FieldPathValue, Path } from 'react-hook-form';
import type {
  FormConfig,
  RenderableFormKey,
  TableFormFieldDefinition,
} from '../engine/form/field-config';

import type { FormDraftValues } from '../engine/form/use-table-form';
import { Controller } from 'react-hook-form';

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
  const definition = form[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          const result = definition.draftSchema.safeParse(value);
          return result.success || result.error.issues[0]?.message || '잘못된 값입니다.';
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
