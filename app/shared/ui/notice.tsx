import type { ComponentProps } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { InfoIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

const noticeRecipe = tv({
  slots: {
    root: 'flex w-fit max-w-full items-start gap-2 rounded-lg px-4 py-3 text-sm leading-6 text-pretty',
    icon: 'mt-1 size-4 shrink-0',
  },
  variants: {
    variant: {
      informative: {
        root: 'bg-bg-informative-weak font-medium text-fg-neutral',
        icon: 'text-fg-informative',
      },
    },
  },
  defaultVariants: {
    variant: 'informative',
  },
});

export type NoticeProps
  = ComponentProps<'div'>
    & VariantProps<typeof noticeRecipe>;

export function Notice({ children, className, variant, ...props }: NoticeProps) {
  const styles = noticeRecipe({ variant });

  return (
    <div {...props} className={styles.root({ className })}>
      <InfoIcon aria-hidden="true" className={styles.icon()} />
      <div>{children}</div>
    </div>
  );
}
