import type { Options } from 'nuqs';
import type { CompiledTableConfig } from '../compile-table-config';
import type { TableConfig } from '../use-table';

import type { UrlBinding } from './url-binding';
import { useQueryStates } from 'nuqs';
import { useCallback } from 'react';

export interface UrlUpdateOptions extends Options {
  resetPage?: boolean;
}

export type UrlValues = Record<string, unknown>;

export type SetUrlValues = (
  updates:
    | Partial<UrlValues>
    | ((current: UrlValues) => Partial<UrlValues>),
  options?: UrlUpdateOptions,
) => Promise<URLSearchParams>;

export interface UrlState {
  values: UrlValues;
  setValues: SetUrlValues;
  updateBinding: <TValue>(
    binding: UrlBinding<TValue>,
    value: TValue | undefined,
    options?: UrlUpdateOptions,
  ) => Promise<URLSearchParams>;
}

/** Owns the single Nuqs transaction shared by every table capability. */
export function useUrlState<TConfig extends TableConfig>(
  compiled: CompiledTableConfig<TConfig>,
): UrlState {
  const [values, setValues] = useQueryStates(compiled.parsers, {
    clearOnDefault: false,
    shallow: true,
  });

  const setUrlValues = useCallback<SetUrlValues>(
    (updates, options = {}) => {
      const { resetPage, ...nuqsOptions } = options;

      return setValues(
        (current) => {
          const next
            = typeof updates === 'function' ? updates(current) : updates;

          if (!resetPage || !compiled.pagination)
            return next;

          return {
            ...next,
            ...compiled.pagination.page.write(1),
          };
        },
        {
          history: 'push',
          ...nuqsOptions,
        },
      );
    },
    [compiled.pagination, setValues],
  );

  const updateBinding = useCallback<UrlState['updateBinding']>(
    (binding, value, options = {}) =>
      setUrlValues(binding.write(value), options),
    [setUrlValues],
  );

  return {
    values,
    setValues: setUrlValues,
    updateBinding,
  };
}
