import type { ReactNode } from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { UserRoundIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

const avatarRecipe = tv({
  slots: {
    root: 'flex shrink-0 items-center justify-center overflow-hidden bg-bg-neutral-weak text-fg-neutral-subtle',
    image: 'size-full object-cover',
    fallback: 'flex size-full items-center justify-center',
    icon: '',
  },
  variants: {
    purpose: {
      account: { root: 'size-7 rounded-full', icon: 'size-4' },
      listing: { root: 'size-11 rounded-[13px] md:size-12 md:rounded-[14px]', icon: 'size-5 md:size-6' },
      profile: { root: 'size-22 rounded-[26px] md:size-30 md:rounded-[34px]', icon: 'size-11 md:size-14' },
    },
  },
});

export type AvatarPurpose = 'account' | 'listing' | 'profile';

export interface AvatarProps {
  purpose: AvatarPurpose;
  src?: string | null;
  label?: string;
  fallback?: ReactNode;
  className?: string;
}

export function Avatar({ className, fallback, label, purpose, src }: AvatarProps) {
  const styles = avatarRecipe({ purpose });

  const labelProps = label === undefined
    ? ({ 'aria-hidden': true } as const)
    : ({ 'aria-label': label, 'role': 'img' } as const);

  return (
    <BaseAvatar.Root {...labelProps} className={styles.root({ className })}>
      {src ? <BaseAvatar.Image alt="" className={styles.image()} src={src} /> : null}
      <BaseAvatar.Fallback className={styles.fallback()}>
        {fallback ?? <UserRoundIcon aria-hidden="true" className={styles.icon()} />}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
