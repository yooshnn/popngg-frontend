import { ChevronDownIcon, LogOutIcon, SquarePenIcon, UserRoundIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useSession } from '~/entities/session';
import { useLogout } from '~/features/auth';
import { Avatar } from '~/shared/ui/avatar';
import { buttonStyles } from '~/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/ui/dropdown-menu';
import { Skeleton } from '~/shared/ui/skeleton';

export function AccountMenu() {
  const { t } = useTranslation();
  const { status, session } = useSession();
  const { mutate: logout } = useLogout();

  if (status === 'pending') {
    return (
      <div aria-hidden="true" className="flex h-9 items-center gap-2 px-1.5 pr-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="hidden h-3.5 w-14 sm:block" />
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <Link className={buttonStyles({ variant: 'neutral-outline', size: 'sm' })} to="/login">
        {t('header.login')}
      </Link>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={session.name}
        className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-1.5 pr-2 text-sm font-medium text-fg-neutral transition-colors hover:bg-bg-neutral-weak active:bg-bg-neutral-weak-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring"
      >
        <Avatar purpose="account" src={session.avatarUrl} />
        <span className="hidden max-w-20 truncate sm:block">{session.name}</span>
        <ChevronDownIcon aria-hidden="true" className="size-3.5 text-fg-neutral-subtle" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48" sideOffset={6}>
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold text-fg-neutral">{session.name}</p>
          <p className="mt-0.5 text-xs text-fg-neutral-subtle">
            {session.id}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem nativeButton={false} render={<Link to={`/user/${session.id}`} />}>
          <UserRoundIcon aria-hidden="true" className="size-4 text-fg-neutral-subtle" />
          {t('header.account.viewProfile')}
        </DropdownMenuItem>
        <DropdownMenuItem nativeButton={false} render={<Link to="/settings" />}>
          <SquarePenIcon aria-hidden="true" className="size-4 text-fg-neutral-subtle" />
          {t('header.account.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-fg-critical" onClick={() => logout()}>
          <LogOutIcon aria-hidden="true" className="size-4" />
          {t('header.account.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
