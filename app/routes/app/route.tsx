import type { Route } from './+types/route';
import { Outlet } from 'react-router';
import { AppFooter } from './ui/app-footer';
import { AppHeader } from './ui/app-header';

export default function AppRoute(_: Route.ComponentProps) {
  return (
    <div className="flex min-h-svh flex-col bg-bg-layer-default">
      <AppHeader />
      <Outlet />
      <AppFooter />
    </div>
  );
}
