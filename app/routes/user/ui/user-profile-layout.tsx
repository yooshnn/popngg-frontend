import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { formatDate } from '~/shared/lib/date';
import { userProfileQuery } from '../api/queries';
import { ProfileIdentity } from './profile-identity';
import { ProfileNav } from './profile-nav';
import { ProfileStats } from './profile-stats';

export function UserProfileLayout({ userId }: { userId: string }) {
  const { i18n, t } = useTranslation();
  const { data: profile } = useQuery(userProfileQuery(userId));

  if (!profile) {
    return null;
  }

  const updatedAt = formatDate(profile.updatedAt, i18n.language, { month: 'long', day: 'numeric' });

  return (
    <article aria-labelledby="user-profile-title" className="py-6 md:py-12">
      <p className="text-right text-xs text-fg-neutral-subtle md:text-sm">
        {t('user.profile.updatedAt', { date: updatedAt })}
      </p>

      <section className="mt-5 grid gap-7 md:mt-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,270px)] md:gap-12">
        <ProfileIdentity profile={profile} />
        <ProfileStats profile={profile} />
      </section>

      <ProfileNav />
      <Outlet />
    </article>
  );
}
