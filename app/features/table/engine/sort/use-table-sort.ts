import type { UrlState } from '../core/use-url-state';
import type { CompiledSortBindings } from './sort-binding';
import { useMemo } from 'react';

export type TableSortOrder = 'asc' | 'desc';

export interface SortConfig<TKey extends string = string> {
  initial: { key: TKey; order: TableSortOrder };
  options: readonly TKey[];
}

export interface SortReturn<TKey extends string = string> {
  options: readonly TKey[];
  key: TKey;
  order: TableSortOrder;
  setKey: (key: TKey) => Promise<URLSearchParams>;
  toggleOrder: () => Promise<URLSearchParams>;
}

/**
 * Falls back to the configured initial key/order for a missing or stale URL
 * value. Shared by useTableSort and buildTableParams so the two can't
 * silently disagree on what "no value yet" means.
 */
export function resolveSortState<TKey extends string>(
  bindings: CompiledSortBindings<TKey>,
  values: UrlState['values'],
): { key: TKey; order: TableSortOrder } {
  const { config } = bindings;
  const parsedKey = bindings.key.read(values);
  const key = config.options.find(option => option === parsedKey)
    ?? config.initial.key;
  const order = bindings.order.read(values) ?? config.initial.order;

  return { key, order };
}

/** Derives sort state and mutations from the shared table query. Bindings carry their own config, so sort is configured exactly when `bindings` is defined. */
export function useTableSort<TKey extends string>(
  bindings: CompiledSortBindings<TKey> | undefined,
  query: UrlState,
): SortReturn<TKey> | undefined {
  const { updateBinding, values } = query;

  return useMemo(() => {
    if (!bindings)
      return undefined;

    const { config } = bindings;
    const { key, order } = resolveSortState(bindings, values);

    return {
      options: config.options,
      key,
      order,
      setKey: (nextKey: TKey) =>
        updateBinding(bindings.key, nextKey, {
          history: 'push',
          resetPage: true,
        }),
      toggleOrder: () =>
        updateBinding(
          bindings.order,
          order === 'asc' ? 'desc' : 'asc',
          { history: 'push', resetPage: true },
        ),
    };
  }, [bindings, updateBinding, values]);
}
