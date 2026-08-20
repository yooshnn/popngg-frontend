import type { UrlParserMap } from './core/url-binding';
import type { CompiledPaginationBindings } from './pagination/pagination-binding';
import type { CompiledSortBindings } from './sort/sort-binding';
import type { SortConfig } from './sort/use-table-sort';
import type { TableConfig } from './use-table';
import { createParserCollector } from './core/collect-parsers';
import { compilePaginationBindings } from './pagination/pagination-binding';
import { compileSortBindings } from './sort/sort-binding';

/** The literal sort-key union declared by a table's `sort.options`. */
export type SortKeyOf<TConfig extends TableConfig>
  = NonNullable<TConfig['sort']> extends SortConfig<infer TKey> ? TKey : string;

/**
 * The literal page-size union declared by a table's `pagination.allowedSizes`.
 * Matches only `allowedSizes`, not `PaginationConfig<TSize>`'s full shape:
 * `initial.size` is rarely written with `as const`, and folding it into the
 * same inferred TSize would widen the union back to `number`.
 */
export type PaginationSizeOf<TConfig extends TableConfig>
  = NonNullable<TConfig['pagination']> extends { allowedSizes: readonly (infer TSize)[] }
    ? (TSize extends number ? TSize : number)
    : number;

export interface CompiledTableConfig<TConfig extends TableConfig = TableConfig> {
  readonly filter: TConfig['filter'];
  readonly form: TConfig['form'];
  readonly parsers: UrlParserMap;
  readonly ownedKeys: readonly string[];
  readonly sort: CompiledSortBindings<SortKeyOf<TConfig>> | undefined;
  readonly pagination: CompiledPaginationBindings<PaginationSizeOf<TConfig>> | undefined;
}

/** Builds every capability's bindings and collects them into one parser map. */
export function compileTableConfig<TConfig extends TableConfig>(
  config: TConfig,
): CompiledTableConfig<TConfig> {
  const collector = createParserCollector();

  for (const [name, binding] of Object.entries(config.filter ?? {})) {
    collector.add(`filter.${name}`, binding);
  }

  for (const [name, field] of Object.entries(config.form ?? {})) {
    collector.add(`form.${name}`, field.binding);
  }

  const sort = config.sort && compileSortBindings(config.sort);
  if (sort) {
    collector.add('sort.key', sort.key);
    collector.add('sort.order', sort.order);
  }

  const pagination = config.pagination && compilePaginationBindings(config.pagination);
  if (pagination) {
    collector.add('pagination.page', pagination.page);
    collector.add('pagination.size', pagination.size);
  }

  const { parsers, ownedKeys } = collector.collect();

  // The literal TKey/TSize unions in CompiledTableConfig<TConfig> can't be
  // recovered from TConfig's own generic-bound type here — see SortKeyOf /
  // PaginationSizeOf. compileSortBindings/compilePaginationBindings already
  // infer them correctly from the concrete `config` value; this cast just
  // tells TS what construction already guarantees.
  return Object.freeze({
    filter: config.filter,
    form: config.form,
    parsers,
    ownedKeys,
    sort: sort && Object.freeze(sort),
    pagination: pagination && Object.freeze(pagination),
  }) as CompiledTableConfig<TConfig>;
}
