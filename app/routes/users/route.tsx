import type { Route } from './+types/route';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TableShell, useTable } from '~/features/table';
import { getInstance } from '~/shared/i18n/middleware.server';
import { containerStyles } from '~/shared/ui/container';
import { PageHeader } from '~/shared/ui/page-header';
import { usersQuery } from './api/queries';
import { tableConfig } from './model/table';
import { UserRankingList } from './ui/user-ranking-list';

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.title }];
}

export function loader({ context }: Route.LoaderArgs) {
  return { title: getInstance(context).t('users.title') };
}

export default function UsersRoute() {
  const { t } = useTranslation();

  const table = useTable(tableConfig);
  const query = useQuery(usersQuery(table.params));

  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <section className="py-8 md:py-12" aria-labelledby="users-title">
        <PageHeader
          description={t('users.description')}
          title={t('users.title')}
          titleId="users-title"
        />

        <TableShell
          getSortLabel={key => t(`users.sort.${key}`)}
          query={query}
          searchPlaceholder={t('users.search.placeholder')}
          table={table}
        >
          {items => <UserRankingList users={items} />}
        </TableShell>
      </section>
    </main>
  );
}
