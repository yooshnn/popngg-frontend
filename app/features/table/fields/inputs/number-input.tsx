import type { ReactNode } from 'react';
import { useId } from 'react';
import { Field, FieldLabel } from '~/shared/ui/field';
import { Input } from '~/shared/ui/input';

export interface NumberInputProps {
  label: ReactNode;
  max: number;
  min: number;
  name?: string;
  placeholder?: string;
  suffix?: ReactNode;
  value: number | undefined;
  onBlur?: () => void;
  onChange: (value: number | undefined) => void;
}

/** A numeric input whose empty string stands for "no bound given". */
export function NumberInput({
  label,
  max,
  min,
  name,
  placeholder,
  suffix,
  value,
  onBlur,
  onChange,
}: NumberInputProps) {
  const id = useId();

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        className="tabular-nums"
        id={id}
        inputMode="numeric"
        max={max}
        min={min}
        name={name}
        placeholder={placeholder}
        step={1}
        suffix={suffix && (
          <span className="pointer-events-none pr-2 text-xs text-fg-neutral-subtle">
            {suffix}
          </span>
        )}
        type="number"
        value={value ?? ''}
        onBlur={onBlur}
        onChange={event => onChange(
          event.target.value ? Number(event.target.value) : undefined,
        )}
      />
    </Field>
  );
}
