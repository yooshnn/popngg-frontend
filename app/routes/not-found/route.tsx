import type { Route } from './+types/route';
import { data } from 'react-router';
import { getInstance } from '~/shared/i18n/middleware.server';

export function loader({ context }: Route.LoaderArgs) {
  throw data(
    { title: getInstance(context).t('notFound.title') },
    { status: 404 },
  );
}

export default function NotFoundRoute() {
  return null;
}
