import type { HistoryOptions } from 'nuqs';
import type { UrlState } from '../core/use-url-state';
import type { CompiledPaginationBindings } from './pagination-binding';
import { useEffect, useMemo } from 'react';
import { normalizePage } from './pagination-binding';

export interface PaginationConfig<TSize extends number = number> {
  initial: { size: TSize };
  allowedSizes: readonly TSize[];
}

export interface PaginationUpdateOptions {
  history?: HistoryOptions;
}

export interface PaginationReturn<TSize extends number = number> {
  page: number;
  size: TSize;
  allowedSizes: readonly TSize[];
  setPage: (
    value: number,
    options?: PaginationUpdateOptions,
  ) => Promise<URLSearchParams>;
  setSize: (value: TSize) => Promise<URLSearchParams>;
}

/**
 * Falls back to the configured initial page/size for a missing or stale URL
 * value. Shared by useTablePagination and buildTableParams so the two
 * can't silently disagree on what "no value yet" means.
 */
export function resolvePaginationState<TSize extends number>(
  bindings: CompiledPaginationBindings<TSize>,
  values: UrlState['values'],
): { page: number; size: TSize } {
  const { config } = bindings;
  const page = normalizePage(bindings.page.read(values));
  const rawSize = bindings.size.read(values);
  const size = config.allowedSizes.find(allowedSize => allowedSize === rawSize)
    ?? config.initial.size;

  return { page, size };
}

/** Derives pagination state and mutations from the shared table query. Bindings carry their own config, so pagination is configured exactly when `bindings` is defined. */
export function useTablePagination<TSize extends number>(
  bindings: CompiledPaginationBindings<TSize> | undefined,
  query: UrlState,
): PaginationReturn<TSize> | undefined {
  const { updateBinding, values } = query;
  const rawPage = bindings?.page.read(values);
  const page = normalizePage(rawPage);

  // Rewrites an out-of-range `page` URL value (e.g. "0", "abc") to the
  // normalized page, without adding a history entry.
  useEffect(() => {
    if (!bindings || rawPage === undefined || rawPage === page)
      return;

    void updateBinding(bindings.page, page, { history: 'replace' });
  }, [bindings, page, rawPage, updateBinding]);

  return useMemo(() => {
    if (!bindings)
      return undefined;

    const { config } = bindings;
    const { size } = resolvePaginationState(bindings, values);

    return {
      page,
      size,
      allowedSizes: config.allowedSizes,
      setPage: (nextPage: number, options = {}) =>
        updateBinding(bindings.page, normalizePage(nextPage), {
          history: options.history ?? 'push',
        }),
      setSize: async (nextSize: TSize) => {
        if (!config.allowedSizes.includes(nextSize)) {
          throw new RangeError(
            `Table page size "${nextSize}" is not included in pagination.allowedSizes.`,
          );
        }

        return updateBinding(bindings.size, nextSize, {
          history: 'push',
          resetPage: true,
        });
      },
    };
  }, [bindings, page, updateBinding, values]);
}
