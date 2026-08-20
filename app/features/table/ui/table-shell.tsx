import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { FilterEntry } from '../engine/filter/use-table-filter';

import type { FormConfig, FormReturn } from '../engine/form/use-table-form';
import type { PaginationReturn } from '../engine/pagination/use-table-pagination';
import type { SortReturn } from '../engine/sort/use-table-sort';
import { useEffect } from 'react';
import { EmptyState, ErrorState, LoadingState } from '~/shared/ui/data-state';
import { getLastPage } from '../engine/pagination/page-range';
import { TableFilter } from './table-filter';
import { TablePagination } from './table-pagination';
import { TableRange } from './table-range';
import { TableSearch } from './table-search';
import { TableSort } from './table-sort';

interface TableShellState<
  F extends FormConfig,
  K extends string,
  TSize extends number,
> {
  filter?: { search: FilterEntry<string | undefined> };
  form?: FormReturn<F>;
  pagination?: PaginationReturn<TSize>;
  sort?: SortReturn<K>;
}

interface TableShellData {
  items: readonly unknown[];
  totalItems: number;
}

export interface TableShellProps<
  TData extends TableShellData,
  F extends FormConfig,
  K extends string,
  TSize extends number,
> {
  children: (items: TData['items']) => ReactNode;
  filterForm?: ReactNode;
  getSortLabel?: (key: K) => ReactNode;
  query: UseQueryResult<TData>;
  searchPlaceholder?: string;
  table: TableShellState<F, K, TSize>;
}

/** Common query states, table toolbar, result slot and pagination rhythm. */
export function TableShell<
  TData extends TableShellData,
  F extends FormConfig,
  K extends string,
  TSize extends number,
>({
  children,
  filterForm,
  getSortLabel,
  query,
  searchPlaceholder,
  table,
}: TableShellProps<TData, F, K, TSize>) {
  const pagination = table.pagination;
  const totalItems = query.data?.totalItems;
  const lastPage = totalItems === undefined || !pagination
    ? undefined
    : getLastPage(totalItems, pagination.size);
  const pageNeedsCorrection
    = !query.isPlaceholderData
      && lastPage !== undefined
      && !!pagination
      && pagination.page > lastPage;

  useEffect(() => {
    if (!pageNeedsCorrection || lastPage === undefined || !pagination)
      return;

    void pagination.setPage(lastPage, { history: 'replace' });
  }, [lastPage, pageNeedsCorrection, pagination]);

  if (query.isPending) {
    return <LoadingState />;
  }

  if (query.isError && !query.data) {
    return (
      <ErrorState
        retrying={query.isFetching}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const data = query.data;

  if (!data) {
    return <EmptyState />;
  }

  if (pageNeedsCorrection) {
    return <LoadingState />;
  }

  const filterTrigger = table.form && filterForm
    ? <TableFilter form={table.form}>{filterForm}</TableFilter>
    : null;
  const sort = table.sort && getSortLabel
    ? <TableSort getLabel={getSortLabel} sort={table.sort} />
    : null;
  const hasToolbar = !!table.filter || !!filterTrigger || !!sort;

  return (
    <div className="mt-8 min-w-0 md:mt-10">
      {hasToolbar && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {table.filter && (
            <TableSearch
              maxLength={50}
              placeholder={searchPlaceholder}
              search={table.filter.search}
            />
          )}
          {(filterTrigger || sort) && (
            <div className="ml-auto flex shrink-0 items-center gap-1">
              {filterTrigger}
              {sort}
            </div>
          )}
        </div>
      )}
      {pagination && <TableRange pagination={pagination} total={data.totalItems} />}
      <div className="mt-2">
        {data.items.length === 0 ? <EmptyState /> : children(data.items)}
      </div>
      {pagination && (
        <TablePagination
          pagination={pagination}
          total={data.totalItems}
        />
      )}
    </div>
  );
}
