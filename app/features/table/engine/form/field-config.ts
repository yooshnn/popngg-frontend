import type { ReactElement } from 'react';
import type { RefCallBack } from 'react-hook-form';
import type { ZodType } from 'zod';

import type { UrlBinding } from '../core/url-binding';

export interface FormFieldConfig<TApplied, TDraft> {
  binding: UrlBinding<TApplied>;
  defaultValue: TDraft;
  draftSchema: ZodType<TDraft>;
  appliedSchema: ZodType<TApplied>;
  toDraft: (value: TApplied | undefined) => TDraft;
  toApplied: (draft: TDraft) => TApplied | undefined;
}

export interface FormFieldRenderProps<TDraft> {
  error?: string;
  field: {
    value: TDraft;
    onChange: (value: TDraft) => void;
    onBlur: () => void;
    name: string;
    ref: RefCallBack;
  };
}

export interface TableFormFieldDefinition<TApplied, TDraft>
  extends FormFieldConfig<TApplied, TDraft> {
  render: (props: FormFieldRenderProps<TDraft>) => ReactElement;
}

export function defineTableFormField<TApplied, TDraft>(
  definition: TableFormFieldDefinition<TApplied, TDraft>,
): TableFormFieldDefinition<TApplied, TDraft> {
  return definition;
}

/** Validates a value read from URL state at the external-input boundary. */
export function readAppliedValue<TApplied, TDraft>(
  field: FormFieldConfig<TApplied, TDraft>,
  value: TApplied | undefined,
): TApplied | undefined {
  if (value === undefined)
    return undefined;

  const result = field.appliedSchema.safeParse(value);
  return result.success ? result.data : undefined;
}

export type FormConfig = Record<string, FormFieldConfig<any, any>>;

export type RenderableFormKey<F extends FormConfig> = {
  [K in keyof F]: F[K] extends TableFormFieldDefinition<any, any> ? K : never;
}[keyof F] & string;
