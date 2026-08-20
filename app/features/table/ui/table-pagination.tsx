import type { PaginationReturn } from '../engine/pagination/use-table-pagination';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { IconButton } from '~/shared/ui/button';
import { clampPage, getLastPage } from '../engine/pagination/page-range';

interface TablePaginationProps<TSize extends number> {
  pagination: PaginationReturn<TSize>;
  total: number;
}

export function TablePagination<TSize extends number>({
  pagination,
  total,
}: TablePaginationProps<TSize>) {
  const { t } = useTranslation();
  const lastPage = getLastPage(total, pagination.size);
  const currentPage = clampPage(
    Math.max(pagination.page, 1),
    total,
    pagination.size,
  );
  const pages = getPageWindow(currentPage, lastPage);
  const hasPrevious = total > 0 && currentPage > 1;
  const hasNext = total > 0 && currentPage < lastPage;

  return (
    <footer className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 py-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:py-4">
      <nav
        className="col-span-2 row-start-1 flex items-center justify-center justify-self-center md:col-span-1 md:col-start-2"
      >
        <PaginationButton
          label={t('dataTable.pagination.first')}
          disabled={!hasPrevious}
          mobileOnly
          onClick={() => pagination.setPage(1)}
        >
          <ChevronFirstIcon aria-hidden="true" className="size-4" />
        </PaginationButton>
        <PaginationButton
          label={t('dataTable.pagination.previous')}
          disabled={!hasPrevious}
          onClick={() => pagination.setPage(currentPage - 1)}
        >
          <ChevronLeftIcon aria-hidden="true" className="size-4" />
        </PaginationButton>
        <span className="w-24 shrink-0 text-center text-sm text-fg-neutral-muted tabular-nums md:hidden" aria-live="polite">
          {t('dataTable.pagination.current', { page: currentPage, total: lastPage })}
        </span>
        <div className="hidden items-center md:flex">
          {pages.map((item, index) => item === '…'
            ? (
                <span
                  className="flex size-11 shrink-0 items-center justify-center font-bold text-fg-neutral-subtle"
                  key={`gap-${pages[index - 1]}-${pages[index + 1]}`}
                >
                  …
                </span>
              )
            : (
                <button
                  aria-current={item === currentPage ? 'page' : undefined}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-medium text-fg-neutral-muted hover:bg-bg-neutral-weak hover:text-fg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring aria-[current=page]:bg-bg-neutral-solid aria-[current=page]:text-fg-neutral-inverted aria-[current=page]:hover:bg-bg-neutral-solid-hover"
                  key={item}
                  type="button"
                  onClick={() => pagination.setPage(item)}
                >
                  {item}
                </button>
              ))}
        </div>
        <PaginationButton
          label={t('dataTable.pagination.next')}
          disabled={!hasNext}
          onClick={() => pagination.setPage(currentPage + 1)}
        >
          <ChevronRightIcon aria-hidden="true" className="size-4" />
        </PaginationButton>
        <PaginationButton
          label={t('dataTable.pagination.last')}
          disabled={!hasNext}
          mobileOnly
          onClick={() => pagination.setPage(lastPage)}
        >
          <ChevronLastIcon aria-hidden="true" className="size-4" />
        </PaginationButton>
      </nav>
      <select
        className="col-start-2 row-start-2 justify-self-end rounded-lg border border-stroke-neutral-weak bg-bg-layer-default px-2 py-1.5 text-xs font-medium text-fg-neutral-muted outline-none transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-stroke-focus-ring md:col-start-3 md:row-start-1"
        value={pagination.size}
        onChange={(event) => {
          const nextSize = pagination.allowedSizes.find(
            size => String(size) === event.target.value,
          );

          if (nextSize !== undefined)
            void pagination.setSize(nextSize);
        }}
      >
        {pagination.allowedSizes.map(size => (
          <option key={size} value={size}>
            {t('dataTable.pagination.pageSizeOption', { size })}
          </option>
        ))}
      </select>
    </footer>
  );
}

function PaginationButton({
  children,
  disabled,
  label,
  mobileOnly = false,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  label: string;
  mobileOnly?: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton
      aria-label={label}
      className={mobileOnly ? 'md:hidden' : undefined}
      disabled={disabled}
      size="md"
      type="button"
      variant="neutral-ghost"
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
}

function getPageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 9)
    return Array.from({ length: total }, (_, index) => index + 1);

  const pages: (number | '…')[] = [current];
  let lower = current - 1;
  let upper = current + 1;

  while (pages.length < 9) {
    if (lower >= 1)
      pages.unshift(lower);
    if (upper <= total)
      pages.push(upper);
    lower -= 1;
    upper += 1;
  }

  if (pages[0] !== 1)
    pages.splice(0, 2, 1, '…');
  if (pages.at(-1) !== total)
    pages.splice(-2, 2, '…', total);

  return pages;
}
