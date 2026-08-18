import { containerStyles } from '~/shared/ui/container';
import { AccountMenu } from './account-menu';
import { MainNav } from './main-nav';
import { LocaleToggle } from './toggle/locale-toggle';
import { TitleToggle } from './toggle/title-toggle';

export function AppHeader() {
  return (
    <div className="bg-bg-layer-default">
      <div className={containerStyles({ className: 'flex h-[42px] items-center justify-end' })}>
        <TitleToggle />
        <LocaleToggle />
      </div>
      <header className={containerStyles({ className: 'relative flex h-[66px] items-center justify-between gap-3' })}>
        <MainNav />
        <div className="flex shrink-0 items-center gap-1.5">
          <AccountMenu />
        </div>
      </header>
    </div>
  );
}
