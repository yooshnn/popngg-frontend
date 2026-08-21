import { MenuIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '~/shared/ui/sheet';
import { Wordmark } from '~/shared/ui/wordmark';

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

interface NavItem {
  to: string;
  label: string;
  activePrefixes: string[];
}

function useNavItems(): NavItem[] {
  const { t } = useTranslation();

  return [
    { to: '/charts', label: t('nav.chart'), activePrefixes: ['/charts', '/chart'] },
    { to: '/users', label: t('nav.user'), activePrefixes: ['/users', '/user'] },
    { to: '/tools', label: t('nav.tool'), activePrefixes: ['/tools'] },
  ];
}

function isNavItemActive(pathname: string, activePrefixes: string[]) {
  return activePrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function MobileNavLink({ to, label, activePrefixes }: NavItem) {
  const { pathname } = useLocation();

  return (
    <SheetClose className={mobileLinkClassName(isNavItemActive(pathname, activePrefixes))} nativeButton={false} render={<NavLink to={to} />}>
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
  const { pathname } = useLocation();

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-5">
      <Sheet>
        <SheetTrigger
          className="inline-flex size-9 items-center justify-center rounded-md text-fg-neutral transition-colors hover:bg-bg-neutral-weak-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring sm:hidden"
          aria-label={t('header.menu.open')}
        >
          <MenuIcon aria-hidden="true" className="size-5" />
        </SheetTrigger>
        <SheetContent title={t('header.menu.navLabel')}>
          <div className="mt-[42px] flex h-[66px] items-center gap-2 px-4">
            <SheetClose
              className="inline-flex size-9 items-center justify-center rounded-md text-fg-neutral hover:bg-bg-neutral-weak-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring"
              aria-label={t('header.menu.close')}
            >
              <XIcon aria-hidden="true" className="size-5" />
            </SheetClose>
            <Wordmark />
          </div>

          <div className="flex flex-1 flex-col px-5 py-6">
            <p className="font-mono text-[.6875rem] font-medium tracking-[.06em] text-fg-neutral-subtle uppercase">
              {t('header.menu.navLabel')}
            </p>
            <nav className="mt-3 flex flex-col gap-1">
              {navItems.map(item => <MobileNavLink key={item.to} {...item} />)}
            </nav>

            <div className="mt-7 border-t border-stroke-neutral-weak pt-6">
              <p className="font-mono text-[.6875rem] font-medium tracking-[.06em] text-fg-neutral-subtle uppercase">
                {t('header.menu.helpLabel')}
              </p>
              <div className="mt-3 flex flex-col gap-1">
                <MobileHelpLink to="/renew" label={t('header.menu.register')} />
                <MobileHelpLink to="/guide" label={t('header.menu.guide')} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Link
        aria-label="popn.gg"
        className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stroke-focus-ring"
        to="/"
      >
        <Wordmark />
      </Link>

      <span aria-hidden="true" className="hidden h-5 w-px bg-stroke-neutral-weak sm:block" />

      <nav className="hidden items-center gap-0.5 sm:flex">
        {navItems.map(({ to, label, activePrefixes }) => (
          <Link key={to} className={desktopLinkClassName({ isActive: isNavItemActive(pathname, activePrefixes) })} to={to}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
