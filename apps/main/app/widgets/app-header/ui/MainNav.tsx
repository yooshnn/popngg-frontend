import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@popngg/ui/components/sheet';
import { MenuIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { Wordmark } from './Wordmark';

function desktopLinkClassName({ isActive }: { isActive: boolean }) {
  return `inline-flex h-10 items-center justify-center rounded-md px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring ${
    isActive
      ? 'bg-bg-brand-weak font-semibold text-fg-brand'
      : 'font-medium text-fg-neutral-muted hover:bg-bg-neutral-weak hover:text-fg-neutral active:bg-bg-neutral-weak-hover'
  }`;
}

function mobileLinkClassName(isActive: boolean) {
  return `w-full rounded-md px-3 py-3 text-left text-base font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring ${
    isActive ? 'bg-bg-brand-weak text-fg-brand' : 'text-fg-neutral hover:bg-bg-neutral-weak-hover'
  }`;
}

function useNavItems() {
  const { t } = useTranslation();

  return [
    { to: '/charts', label: t('nav.chart') },
    { to: '/users', label: t('nav.user') },
    { to: '/tools', label: t('nav.tool') },
  ];
}

function MobileNavLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();

  return (
    <SheetClose className={mobileLinkClassName(pathname === to)} nativeButton={false} render={<NavLink to={to} />}>
      {label}
    </SheetClose>
  );
}

function MobileHelpLink({ to, label }: { to: string; label: string }) {
  return (
    <SheetClose
      className="w-full rounded-md px-3 py-3 text-left text-sm text-fg-neutral-muted hover:bg-bg-neutral-weak-hover hover:text-fg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring"
      nativeButton={false}
      render={<NavLink to={to} />}
    >
      {label}
    </SheetClose>
  );
}

export function MainNav() {
  const { t } = useTranslation();
  const navItems = useNavItems();

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-5">
      <Sheet>
        <SheetTrigger
          className="inline-flex size-9 items-center justify-center rounded-md text-fg-neutral transition-colors hover:bg-bg-neutral-weak-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring sm:hidden"
          aria-label={t('header.menu.open')}
        >
          <MenuIcon aria-hidden="true" className="size-5" />
        </SheetTrigger>
        <SheetContent title={t('header.menu.title')} description={t('header.menu.description')}>
          <div className="mt-[42px] flex h-[66px] items-center gap-2 px-4">
            <SheetClose
              className="inline-flex size-9 items-center justify-center rounded-md text-fg-neutral hover:bg-bg-neutral-weak-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring"
              aria-label={t('header.menu.close')}
            >
              <XIcon aria-hidden="true" className="size-5" />
            </SheetClose>
            <Wordmark variant="split" />
          </div>

          <div className="flex flex-1 flex-col px-5 py-6">
            <p className="font-mono text-[.6875rem] font-medium tracking-[.06em] text-fg-neutral-subtle uppercase">
              {t('header.menu.navLabel')}
            </p>
            <nav className="mt-3 flex flex-col gap-1" aria-label={t('nav.ariaLabel')}>
              {navItems.map(item => <MobileNavLink key={item.to} {...item} />)}
            </nav>

            <div className="mt-7 border-t border-stroke-neutral-weak pt-6">
              <p className="font-mono text-[.6875rem] font-medium tracking-[.06em] text-fg-neutral-subtle uppercase">
                {t('header.menu.helpLabel')}
              </p>
              <div className="mt-3 flex flex-col gap-1">
                <MobileHelpLink to="/register" label={t('footer.groups.link.register')} />
                <MobileHelpLink to="/guide" label={t('footer.groups.doc.guide')} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Wordmark />

      <span aria-hidden="true" className="hidden h-5 w-px bg-stroke-neutral-weak sm:block" />

      <nav className="hidden items-center gap-0.5 sm:flex" aria-label={t('nav.ariaLabel')}>
        {navItems.map(({ to, label }) => (
          <NavLink key={to} className={desktopLinkClassName} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
