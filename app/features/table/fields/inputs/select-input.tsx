import type { ReactNode } from 'react';
import type { FieldLevel } from '~/shared/ui/field';
import { useId } from 'react';
import { Field, FieldLabel } from '~/shared/ui/field';
import { inputStyles } from '~/shared/ui/input';

type SelectValue = string | number;

export interface SelectInputOption<TValue extends SelectValue> {
  value: TValue;
  label: string;
}

export interface SelectInputProps<TValue extends SelectValue> {
  emptyLabel: string;
  label: ReactNode;
  labelVariant?: FieldLevel;
  name?: string;
  options: readonly SelectInputOption<TValue>[];
  value: TValue | undefined;
  onBlur?: () => void;
  onChange: (value: TValue | undefined) => void;
}

/** A native select whose empty option stands for "no choice made". */
export function SelectInput<TValue extends SelectValue>({
  emptyLabel,
  label,
  labelVariant,
  name,
  options,
  value,
  onBlur,
  onChange,
}: SelectInputProps<TValue>) {
  const id = useId();

  return (
    <Field>
      <FieldLabel htmlFor={id} variant={labelVariant}>{label}</FieldLabel>
      <select
        className={inputStyles()}
        id={id}
        name={name}
        value={value ?? ''}
        onBlur={onBlur}
        onChange={(event) => {
          const serialized = event.target.value;

          onChange(serialized
            ? options.find(option => String(option.value) === serialized)?.value
            : undefined);
        }}
      >
        <option value="">{emptyLabel}</option>
        {options.map(option => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
