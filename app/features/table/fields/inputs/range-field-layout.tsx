import type { ReactNode } from 'react';
import { Field, FieldError, FieldLabel } from '~/shared/ui/field';

export interface RangeFieldLayoutProps {
  children: ReactNode;
  error?: string;
  label: ReactNode;
}

/** Lays a range field's two bound inputs side by side above its error. */
export function RangeFieldLayout({
  children,
  error,
  label,
}: RangeFieldLayoutProps) {
  return (
    <Field>
      <FieldLabel variant="label">{label}</FieldLabel>
      <div className="grid grid-cols-2 gap-2">{children}</div>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
