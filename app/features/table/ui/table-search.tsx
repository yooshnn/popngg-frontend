import type { FilterEntry } from '../engine/filter/use-table-filter';
import { SearchIcon } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useDebouncedSearch } from './use-debounced-search';

interface TableSearchProps {
  search: FilterEntry<string | undefined>;
  maxLength?: number;
  placeholder?: string;
}

export function TableSearch({
  maxLength,
  placeholder,
  search,
}: TableSearchProps) {
  const { t } = useTranslation();
  const input = useDebouncedSearch({
    value: search.value,
    onCommit: value => void search.setValue(value, { history: 'replace' }),
  });

  return (
    <div className="relative h-11 w-full shrink-0 sm:max-w-sm sm:flex-1">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-fg-neutral-subtle"
      />
      <input
        {...input}
        className="h-full w-full rounded-full border border-stroke-neutral-weak bg-bg-layer-default pr-4 pl-10 text-sm text-fg-neutral outline-none transition-[border-color,box-shadow] placeholder:text-fg-placeholder focus:border-transparent focus:ring-2 focus:ring-stroke-focus-ring"
        maxLength={maxLength}
        placeholder={placeholder ?? t('dataTable.search.placeholder')}
        type="search"
      />
    </div>
  );
}
