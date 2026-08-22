import type { Route } from './+types/route';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { isHTTPError } from 'ky';
import { data } from 'react-router';
import { getQueryClient } from '~/shared/api';
import { ServerApiContext } from '~/shared/api/middleware.server';
import { getInstance } from '~/shared/i18n/middleware.server';
import { pageTitle } from '~/shared/lib/seo';
import { containerStyles } from '~/shared/ui/container';
import { userProfileQuery } from './api/queries';
import { UserProfileLayout } from './ui/user-profile-layout';

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData ? [{ title: pageTitle(loaderData.name) }] : [];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const queryClient = getQueryClient();
  const request = context.get(ServerApiContext);

  try {
    const profile = await queryClient.fetchQuery(userProfileQuery(params.userId, request));

    return { name: profile.name, dehydratedState: dehydrate(queryClient) };
  }
  catch (error) {
    if (isHTTPError(error) && error.response.status === 404) {
      throw data({ title: getInstance(context).t('notFound.title') }, { status: 404 });
    }
    throw error;
  }
}

export default function UserRoute({ loaderData, params }: Route.ComponentProps) {
  return (
    <main className={containerStyles({ className: 'flex-1' })}>
      <HydrationBoundary state={loaderData.dehydratedState}>
        <UserProfileLayout userId={params.userId} />
      </HydrationBoundary>
    </main>
  );
}
