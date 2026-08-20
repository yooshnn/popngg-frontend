import type { UrlState } from '../core/use-url-state';
import type {
  FormConfig,
  FormFieldConfig,
} from './field-config';

import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  clearFormValues,
  getEmptyDraftValues,
  readFormValues,
  serializeFormValues,
  toFormAppliedValues,
  toFormDraftValues,
  validateFormDraftValues,
  writeFormValues,
} from './form-values';

export type { FormConfig } from './field-config';

export type FormValues<F extends FormConfig> = {
  [K in keyof F]: FormAppliedValue<F[K]>;
};

export type FormDraftValues<F extends FormConfig> = {
  [K in keyof F]: F[K] extends FormFieldConfig<any, infer TDraft>
    ? TDraft
    : never;
};

export interface FormReturn<F extends FormConfig> {
  values: FormValues<F>;
  apply: (values: FormDraftValues<F>) => Promise<URLSearchParams>;
  resetDraft: () => void;
  discardDraft: () => void;
  clear: () => Promise<URLSearchParams>;
  control: import('react-hook-form').Control<FormDraftValues<F>>;
  handleSubmit: import('react-hook-form').UseFormHandleSubmit<FormDraftValues<F>>;
  isActive: boolean;
  isValid: boolean;
}

export type FormAppliedValue<TField> = TField extends FormFieldConfig<
  infer TApplied,
  any
>
  ? TApplied | undefined
  : never;

type TableFormConfig = FormConfig;
type TableFormDraftValues = FormDraftValues<TableFormConfig>;

export function useTableForm<F extends TableFormConfig>(
  config: F | undefined,
  query: UrlState,
): FormReturn<F> | undefined {
  const { values, setValues: setUrlValues } = query;

  const appliedValues = useMemo(
    () => readFormValues(config, values),
    [config, values],
  );
  const appliedSnapshot = useMemo(
    () => serializeFormValues(config, appliedValues),
    [appliedValues, config],
  );
  const emptyDraftValues = useMemo(
    () => getEmptyDraftValues(config),
    [config],
  );
  const appliedDraftValues = useMemo(
    () => toFormDraftValues(config, appliedValues),
    [appliedValues, config],
  );
  const initialSnapshot = useMemo(
    () => serializeFormValues(config, {}),
    [config],
  );

  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<TableFormDraftValues>({
    defaultValues: appliedDraftValues,
    mode: 'onChange',
  });

  const apply = useCallback(
    async (draftValues: FormDraftValues<FormConfig>) => {
      const validatedDraftValues = validateFormDraftValues(config, draftValues);
      const applied = toFormAppliedValues(config, validatedDraftValues);
      reset(toFormDraftValues(config, applied), { keepDefaultValues: true });

      return setUrlValues(
        current => ({
          ...current,
          ...writeFormValues(config, applied),
        }),
        { history: 'push', resetPage: true },
      );
    },
    [config, reset, setUrlValues],
  );

  const resetDraft = useCallback(
    () => reset(emptyDraftValues, { keepDefaultValues: true }),
    [emptyDraftValues, reset],
  );

  const discardDraft = useCallback(
    () => reset(appliedDraftValues, { keepDefaultValues: true }),
    [appliedDraftValues, reset],
  );

  const clear = useCallback(() => {
    reset(emptyDraftValues, { keepDefaultValues: true });
    return setUrlValues(
      current => ({
        ...current,
        ...clearFormValues(config),
      }),
      { history: 'push', resetPage: true },
    );
  }, [config, emptyDraftValues, reset, setUrlValues]);

  return useMemo(
    () =>
      config
        ? ({
            values: appliedValues,
            apply,
            resetDraft,
            discardDraft,
            clear,
            control,
            handleSubmit,
            isActive: appliedSnapshot !== initialSnapshot,
            isValid,
          } as FormReturn<F>)
        : undefined,
    [
      appliedValues,
      appliedSnapshot,
      apply,
      clear,
      config,
      control,
      discardDraft,
      handleSubmit,
      initialSnapshot,
      isValid,
      resetDraft,
    ],
  );
}
