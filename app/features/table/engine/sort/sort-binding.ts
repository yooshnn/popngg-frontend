import type { UrlBinding } from '../core/url-binding';
import type { SortConfig, TableSortOrder } from './use-table-sort';
import { parseAsStringLiteral } from 'nuqs';
import { singleKeyBinding } from '../core/url-binding';

const TABLE_SORT_ORDERS = ['asc', 'desc'] as const;

/** Sort bindings bundled with the declared config they were compiled from. */
export interface CompiledSortBindings<TKey extends string = string> {
  readonly config: SortConfig<TKey>;
  readonly key: UrlBinding<TKey>;
  readonly order: UrlBinding<TableSortOrder>;
}

export function compileSortBindings<TKey extends string>(
  sortConfig: SortConfig<TKey>,
): CompiledSortBindings<TKey> {
  if (!sortConfig.options.includes(sortConfig.initial.key)) {
    throw new Error(
      `Initial table sort key "${sortConfig.initial.key}" must be included in sort.options.`,
    );
  }

  return {
    config: sortConfig,
    key: singleKeyBinding('sort', parseAsStringLiteral(sortConfig.options)),
    order: singleKeyBinding('order', parseAsStringLiteral(TABLE_SORT_ORDERS)),
  };
}
