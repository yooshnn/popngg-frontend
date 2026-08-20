import type { ReactNode } from 'react';
import type { SortReturn } from '../engine/sort/use-table-sort';
import { ArrowDownUpIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { IconButton } from '~/shared/ui/button';

interface TableSortProps<TKey extends string> {
  getLabel: (key: TKey) => ReactNode;
  sort: SortReturn<TKey>;
}

export function TableSort<TKey extends string>({
  getLabel,
  sort,
}: TableSortProps<TKey>) {
  const { t } = useTranslation();
  const OrderIcon = sort.order === 'asc' ? ChevronUpIcon : ChevronDownIcon;

  return (
    <>
      <label className="relative flex h-11 min-w-0 items-center rounded-lg text-fg-neutral-muted transition-colors hover:bg-bg-neutral-weak hover:text-fg-neutral">
        <select
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring"
          value={sort.key}
          onChange={(event) => {
            const key = sort.options.find(
              option => option === event.target.value,
            );
            if (key !== undefined)
              void sort.setKey(key);
          }}
        >
          {sort.options.map(key => (
            <option key={key} value={key}>
              {getLabel(key)}
            </option>
          ))}
        </select>
        <span className="pointer-events-none inline-flex h-11 items-center gap-2 px-3.5 text-sm font-medium">
          <ArrowDownUpIcon aria-hidden="true" className="size-4 shrink-0" />
          {t('dataTable.sort.label')}
        </span>
      </label>
      <IconButton
        aria-label={sort.order === 'desc' ? t('dataTable.sort.toAscending') : t('dataTable.sort.toDescending')}
        className="size-11 shrink-0"
        size="md"
        type="button"
        variant="neutral-weak"
        onClick={sort.toggleOrder}
      >
        <OrderIcon aria-hidden="true" className="size-4" />
      </IconButton>
    </>
  );
}
