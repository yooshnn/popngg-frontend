import type { PaginationReturn } from '../engine/pagination/use-table-pagination';

import { useTranslation } from 'react-i18next';
import { clampPage } from '../engine/pagination/page-range';

interface TableRangeProps<TSize extends number> {
  pagination: PaginationReturn<TSize>;
  total: number;
}

export function TableRange<TSize extends number>({
  pagination,
  total,
}: TableRangeProps<TSize>) {
  const { t } = useTranslation();
  const page = clampPage(Math.max(pagination.page, 1), total, pagination.size);
  const from = total === 0 ? 0 : (page - 1) * pagination.size + 1;
  const to = Math.min(page * pagination.size, total);

  return (
    <div className="mt-4 flex min-h-9 items-center justify-between gap-3 px-1">
      <p className="font-mono text-[.6875rem] font-bold tracking-[.08em] text-fg-neutral-subtle tabular-nums" data-testid="result-count">
        {total === 0 ? t('dataTable.empty') : t('dataTable.range', { from, to, total })}
      </p>
    </div>
  );
}
