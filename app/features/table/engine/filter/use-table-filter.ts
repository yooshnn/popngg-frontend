import type { HistoryOptions } from 'nuqs';
import type { UrlBinding } from '../core/url-binding';

import type { UrlState } from '../core/use-url-state';
import { useMemo } from 'react';

export interface FilterUpdateOptions {
  history?: HistoryOptions;
}

export type FilterConfig = Record<string, UrlBinding<any>>;

export type FilterReturn<C extends FilterConfig> = {
  [K in keyof C]: FilterEntry<BindingValue<C[K]>>;
};

export interface FilterEntry<TValue> {
  value: TValue;
  setValue: (
    value: TValue,
    options?: FilterUpdateOptions,
  ) => Promise<URLSearchParams>;
}

export type BindingValue<TBinding> = TBinding extends UrlBinding<infer TValue>
  ? TValue | undefined
  : never;

/** Derives filter values and mutations from the shared table query. */
export function useTableFilter<C extends FilterConfig>(
  config: C | undefined,
  query: UrlState,
): FilterReturn<C> | undefined {
  const { updateBinding, values } = query;

  return useMemo(() => {
    if (!config)
      return undefined;

    return Object.fromEntries(
      Object.entries(config).map(([key, binding]) => [
        key,
        {
          value: binding.read(values),
          setValue: (value: unknown, options?: FilterUpdateOptions) =>
            updateBinding(binding, value, {
              history: options?.history ?? 'push',
              resetPage: true,
            }),
        },
      ]),
    ) as FilterReturn<C>;
  }, [config, updateBinding, values]);
}
