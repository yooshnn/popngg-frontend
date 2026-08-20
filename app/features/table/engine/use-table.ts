import type { PaginationSizeOf, SortKeyOf } from './compile-table-config';
import type { FilterConfig, FilterReturn } from './filter/use-table-filter';

import type { FormConfig, FormReturn } from './form/use-table-form';
import type { PaginationConfig, PaginationReturn } from './pagination/use-table-pagination';
import type { SortConfig, SortReturn } from './sort/use-table-sort';
import { useMemo, useState } from 'react';
import { buildTableParams } from './build-table-params';
import { compileTableConfig } from './compile-table-config';
import { useUrlState } from './core/use-url-state';
import { useTableFilter } from './filter/use-table-filter';
import { useTableForm } from './form/use-table-form';
import {

  useTablePagination,
} from './pagination/use-table-pagination';
import { useTableSort } from './sort/use-table-sort';

export interface TableConfig {
  sort?: SortConfig;
  filter?: FilterConfig;
  form?: FormConfig;
  pagination?: PaginationConfig;
}

type WhenConfigured<TConfig, TReturn> = undefined extends TConfig
  ? undefined
  : TReturn;

export interface TableReturn<TConfig extends TableConfig> {
  /** Validated URL state encoded with only the params owned by this table. */
  params: URLSearchParams;
  sort: WhenConfigured<TConfig['sort'], SortReturn<SortKeyOf<TConfig>>>;
  filter: WhenConfigured<
    TConfig['filter'],
    FilterReturn<NonNullable<TConfig['filter']>>
  >;
  form: WhenConfigured<
    TConfig['form'],
    FormReturn<NonNullable<TConfig['form']>>
  >;
  pagination: WhenConfigured<
    TConfig['pagination'],
    PaginationReturn<PaginationSizeOf<TConfig>>
  >;
}

/** Binds one table config to one Nuqs query-state transaction. */
export function useTable<TConfig extends TableConfig>(
  config: TConfig,
): TableReturn<TConfig> {
  const [compiled] = useState(() => compileTableConfig(config));
  const query = useUrlState(compiled);
  const filter = useTableFilter(compiled.filter, query);
  const sort = useTableSort(compiled.sort, query);
  const form = useTableForm(compiled.form, query);
  const pagination = useTablePagination(compiled.pagination, query);

  const params = useMemo(
    () => buildTableParams(compiled, query.values),
    [compiled, query.values],
  );

  return {
    params,
    sort,
    filter,
    form,
    pagination,
  } as TableReturn<TConfig>;
}

export type {
  SetUrlValues,
  UrlUpdateOptions,
} from './core/use-url-state';
