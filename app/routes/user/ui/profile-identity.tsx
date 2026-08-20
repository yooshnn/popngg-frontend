import type { UserProfile } from '../model/types';
import { HeartIcon } from 'lucide-react';
import { Avatar } from '~/shared/ui/avatar';

export function ProfileIdentity({ profile }: { profile: UserProfile }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-4 md:gap-7">
        <Avatar purpose="profile" src={profile.avatarUrl} />

        <div className="min-w-0">
          <h1
            className="text-3xl leading-[1.15] font-bold tracking-[-.055em] break-all md:text-4xl"
            id="user-profile-title"
          >
            {profile.name}
          </h1>

          <p className="mt-2.5 inline-flex min-h-7 items-center rounded-md bg-bg-neutral-weak px-2 font-mono text-[.6875rem] text-fg-neutral-muted md:mt-3 md:min-h-8 md:px-2.5 md:text-sm">
            #
            {' '}
            {profile.poptomoId}
          </p>

          <p className="mt-2.5 flex items-center gap-1.5 text-sm font-medium text-fg-brand md:mt-3">
            <HeartIcon aria-hidden="true" className="size-4" fill="currentColor" strokeWidth={0} />
            {profile.character}
          </p>
        </div>
      </div>

      <blockquote className="mt-7 max-w-140 border-l-[3px] border-stroke-neutral-muted pl-3.5 text-[.9375rem] leading-7 text-fg-neutral-muted md:mt-8 md:pl-4 md:text-base">
        {profile.comment}
      </blockquote>
    </div>
  );
}
