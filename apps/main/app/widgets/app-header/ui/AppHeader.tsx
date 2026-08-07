import { containerStyles } from '@popngg/ui/components/container';
import { useTranslation } from 'react-i18next';
import { AccountMenu } from './AccountMenu';
import { MainNav } from './MainNav';
import { UtilityBar } from './UtilityBar';

export function AppHeader() {
  const { t } = useTranslation();

  return (
    <div className="bg-bg-layer-default">
      <UtilityBar />
      <header
        className={containerStyles({ className: 'relative flex h-[66px] items-center justify-between gap-3' })}
        aria-label={t('header.landmarkLabel')}
      >
        <MainNav />
        <div className="flex shrink-0 items-center gap-1.5">
          <AccountMenu />
        </div>
      </header>
    </div>
  );
}
