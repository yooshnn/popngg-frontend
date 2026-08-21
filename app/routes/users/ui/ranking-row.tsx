import type { BestLevels, UserSummary } from '../model/types';
import { useTranslation } from 'react-i18next';
import { clearType } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';
import { useRelativeDate } from '~/shared/lib/use-relative-date';
import { Avatar } from '~/shared/ui/avatar';
import { Link } from '~/shared/ui/link';

const columns = 'grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3.5 gap-y-0.5 px-4 sm:px-5 md:grid-cols-[3rem_auto_minmax(0,1fr)_8rem_5rem_5rem] md:gap-x-4 md:gap-y-1 md:px-0';

export function RankingHeader() {
  const { t } = useTranslation();

  return (
    <div className={`hidden border-b border-stroke-neutral-muted text-xs font-medium text-fg-neutral-subtle md:grid ${columns}`}>
      <span className="col-start-1 flex h-12 items-center justify-center">{t('users.column.rank')}</span>
      <span className="col-start-3 flex h-12 items-center">{t('users.column.user')}</span>
      <span className="col-start-4 flex h-12 items-center justify-center">{t('users.column.bestLevel')}</span>
      <span className="col-start-5 flex h-12 items-center justify-center">{t('users.column.popnClass')}</span>
      <span className="col-start-6 flex h-12 items-center justify-center">{t('users.column.updatedAt')}</span>
    </div>
  );
}

export function RankingRow({ user }: { user: UserSummary }) {
  const formatRelativeDate = useRelativeDate();
  const profilePath = `/user/${user.poptomoId}`;

  return (
    <li className={`grid items-baseline py-5 md:items-center md:py-4 ${columns}`}>
      <span className="col-start-1 row-start-1 pb-2.5 font-mono text-xs font-medium tabular-nums text-fg-neutral-subtle before:content-['#'] md:row-span-2 md:justify-self-center md:pb-0 md:before:content-none">
        {user.rank}
      </span>

      <time
        className="col-start-3 row-start-1 justify-self-end pb-2.5 text-xs md:text-sm whitespace-nowrap text-fg-placeholder md:col-start-6 md:row-span-2 md:justify-self-center md:pb-0"
        dateTime={user.updatedAt.toISOString()}
      >
        {formatRelativeDate(user.updatedAt)}
      </time>

      <Link
        aria-hidden="true"
        className="col-start-1 row-start-2 row-span-2 self-center rounded-[13px] md:col-start-2 md:row-start-1 md:rounded-[14px]"
        tabIndex={-1}
        to={profilePath}
        underline="none"
      >
        <Avatar purpose="listing" src={user.avatarUrl} />
      </Link>

      <Link
        className="col-start-2 row-start-2 w-fit max-w-full truncate text-base font-medium text-fg-neutral md:col-start-3 md:row-start-1"
        to={profilePath}
        underline="hover"
      >
        {user.name}
      </Link>

      <span className="col-start-2 row-start-3 truncate text-xs text-fg-neutral-subtle md:col-start-3 md:row-start-2">
        {user.comment}
      </span>

      <BestLevelList
        className="col-start-3 row-start-3 justify-self-end md:col-start-4 md:row-start-1 md:row-span-2 md:justify-self-center"
        levels={user.bestLevels}
      />

      <span className="col-start-3 row-start-2 justify-self-end text-sm leading-5 tracking-tight tabular-nums text-fg-neutral md:col-start-5 md:row-start-1 md:row-span-2 md:justify-self-center">
        {popnClass.format(user.popnClass)}
      </span>
    </li>
  );
}

function BestLevelList({ className, levels }: { className: string; levels: BestLevels }) {
  const { t } = useTranslation();
  const format = (level: number | null) => level ?? t('users.bestLevel.none');

  return (
    <span
      aria-label={t('users.bestLevel.label', {
        clear: format(levels.clear),
        fullCombo: format(levels['full-combo']),
        perfect: format(levels.perfect),
      })}
      className={`inline-flex items-baseline gap-1.5 text-xs font-semibold whitespace-nowrap tabular-nums md:text-sm ${className}`}
    >
      {clearType.milestones.map((milestone, index) => (
        <span className="contents" key={milestone}>
          {index > 0 && <span aria-hidden="true" className="font-normal text-stroke-neutral-weak">/</span>}
          <span style={{ color: clearType.color(milestone) }}>{format(levels[milestone])}</span>
        </span>
      ))}
    </span>
  );
}
