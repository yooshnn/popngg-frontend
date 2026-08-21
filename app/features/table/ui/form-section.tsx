import type { ReactNode } from 'react';
import { FieldLegend, FieldSet } from '~/shared/ui/field';

export interface FormSectionProps {
  children: ReactNode;
  title: string;
}

/** Groups related filter fields under one legend. */
export function FormSection({ children, title }: FormSectionProps) {
  return (
    <FieldSet className="pt-4">
      <FieldLegend>{title}</FieldLegend>
      {children}
    </FieldSet>
  );
}
