import { containerStyles } from '@popngg/ui/components/container';
import { Outlet } from 'react-router';
import { AppFooter } from '~/widgets/app-footer';
import { AppHeader } from '~/widgets/app-header';

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className={containerStyles({ className: 'flex-1' })}>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
