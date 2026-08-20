import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { tabs } from '../model/tabs';

function linkClassName({ isActive }: { isActive: boolean }) {
  return `relative inline-flex h-14 flex-1 items-center justify-center px-5 text-base font-medium whitespace-nowrap text-fg-neutral transition-colors after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-[max(2.5rem,calc(100%-1.25rem))] after:-translate-x-1/2 after:bg-bg-brand-solid after:transition-transform hover:bg-bg-neutral-weak focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring md:flex-none md:rounded-md ${
    isActive ? 'after:scale-x-100' : 'after:scale-x-0'
  }`;
}

export function ProfileNav() {
  const { t } = useTranslation();

  return (
    <nav className="-mx-4 mt-10 touch-pan-x scrollbar-none overflow-x-auto overscroll-x-contain scroll-smooth sm:-mx-5 md:mx-0 md:mt-14">
      <div className="flex w-max min-w-full items-center border-b border-stroke-neutral-weak md:min-w-0 md:border-b-0">
        {tabs.map(tab => (
          <NavLink key={tab.id} className={linkClassName} end={tab.end} to={tab.path}>
            {t(`user.tab.${tab.id}.label`)}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
