import type { Route } from './+types/route';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TableShell, useTable } from '~/features/table';
import { getInstance } from '~/shared/i18n/middleware.server';
import { pageTitle } from '~/shared/lib/seo';
import { containerStyles } from '~/shared/ui/container';
import { PageHeader } from '~/shared/ui/page-header';
import { chartsQuery } from './api/queries';
import { tableConfig } from './model/table';
import { FilterForm } from './ui/filter-form';
import { SongList } from './ui/song-list';

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: pageTitle(loaderData.title) }];
}

export function loader({ context }: Route.LoaderArgs) {
  return { title: getInstance(context).t('charts.title') };
}

export default function ChartsRoute() {
  const { t } = useTranslation();

  const table = useTable(tableConfig);
  const query = useQuery(chartsQuery(table.params));

  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <section className="py-8 md:py-12" aria-labelledby="charts-title">
        <PageHeader
          description={t('charts.description')}
          title={t('charts.title')}
          titleId="charts-title"
        />

        <TableShell
          filterForm={<FilterForm control={table.form.control} />}
          getSortLabel={key => t(`charts.sort.${key}`)}
          query={query}
          searchPlaceholder={t('charts.search.placeholder')}
          table={table}
        >
          {items => <SongList songs={items} />}
        </TableShell>
      </section>
    </main>
  );
}
