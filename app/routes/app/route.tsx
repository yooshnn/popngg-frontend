import type { Route } from './+types/route';
import { isRouteErrorResponse, Outlet } from 'react-router';
import { pageTitle } from '~/shared/lib/seo';
import { NotFoundPage } from './ui/error/not-found-page';
import { UnexpectedErrorPage } from './ui/error/unexpected-error-page';
import { AppFooter } from './ui/shell/app-footer';
import { AppHeader } from './ui/shell/app-header';

export function meta({ error }: Route.MetaArgs) {
  if (isRouteErrorResponse(error) && typeof error.data === 'object' && error.data !== null && 'title' in error.data && typeof error.data.title === 'string') {
    return [{ title: pageTitle(error.data.title) }];
  }

  return [];
}

export default function AppRoute() {
  return (
    <AppChrome>
      <Outlet />
    </AppChrome>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <AppChrome>
      {isNotFound ? <NotFoundPage /> : <UnexpectedErrorPage />}
    </AppChrome>
  );
}

function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-bg-layer-default">
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
}
