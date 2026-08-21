import type { ReactElement } from 'react';
import type { RefCallBack } from 'react-hook-form';
import type { ZodType } from 'zod';

import type { UrlBinding } from '../core/url-binding';

/**
 * One filter field.
 *
 * Discarding unusable URL state is the binding's responsibility: `read` yields
 * a valid value or `undefined`, and `undefined` seeds the form with
 * `defaultValue`. The draft schema only judges what the user types, and its
 * issues carry any interpolation values they need as `params`.
 */
export interface FormFieldConfig<TApplied, TDraft> {
  binding: UrlBinding<TApplied>;
  defaultValue: TDraft;
  /** Issue messages are translation keys, not literals. */
  schema: ZodType<TDraft>;
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

export type FormConfig = Record<string, FormFieldConfig<any, any>>;

export type RenderableFormKey<F extends FormConfig> = {
  [K in keyof F]: F[K] extends TableFormFieldDefinition<any, any> ? K : never;
}[keyof F] & string;
