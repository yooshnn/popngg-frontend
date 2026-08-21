import type { Route } from './+types/route';
import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useTranslation } from 'react-i18next';
import { TableShell, useTable } from '~/features/table';
import { SectionHeader } from '~/shared/ui/section-header';
import { userRecordsQuery } from './api/queries';
import { viewSearchParams } from './lib/view-search-params';
import { tableConfig } from './model/table';
import { FilterForm } from './ui/filter-form';
import { Results } from './ui/results';
import { ViewControl } from './ui/view-control';

export default function UserRecordsRoute({ params }: Route.ComponentProps) {
  const { t } = useTranslation();
  const table = useTable(tableConfig);
  const query = useQuery(userRecordsQuery(params.userId, table.params));
  const [{ view }, setSearchParams] = useQueryStates(viewSearchParams);

  return (
    <section className="mt-10 md:mt-14" aria-labelledby="user-records-title">
      <SectionHeader
        action={<ViewControl value={view} onValueChange={view => setSearchParams({ view })} />}
        description={t('user.records.description')}
        title={t('user.records.title')}
        titleId="user-records-title"
      />

      <TableShell
        filterForm={<FilterForm control={table.form.control} />}
        getSortLabel={key => t(`user.records.sort.${key}`)}
        query={query}
        searchPlaceholder={t('user.records.search.placeholder')}
        table={table}
      >
        {items => <Results records={items} view={view} />}
      </TableShell>
    </section>
  );
}
