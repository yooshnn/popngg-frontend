import type { ComponentProps, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { Dialog } from '@base-ui/react/dialog';
import { tv } from 'tailwind-variants';

const sheetRecipe = tv({
  slots: {
    backdrop: 'fixed inset-0 z-40 bg-bg-neutral-solid/25 backdrop-blur-[1px] transition-opacity duration-150 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none',
    viewport: 'fixed inset-0 z-50 flex',
    popup: 'flex translate-x-0 translate-y-0 flex-col bg-bg-layer-default outline-none transition-[translate,opacity] duration-150 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none',
  },
  variants: {
    side: {
      left: {
        popup: 'h-full w-[min(20.5rem,calc(100vw-2.5rem))] border-r border-stroke-neutral-weak shadow-[12px_0_36px_#1a1c2029] data-starting-style:-translate-x-full data-ending-style:-translate-x-full',
      },
      bottom: {
        viewport: 'items-end',
        popup: 'max-h-[calc(100dvh-1rem)] w-full rounded-t-[1.25rem] border-t border-stroke-neutral-weak shadow-[0_-12px_36px_#1a1c2029] data-starting-style:translate-y-full data-ending-style:translate-y-full',
      },
    },
  },
  defaultVariants: {
    side: 'left',
  },
});

export type SheetContentProps
  = Omit<ComponentProps<typeof Dialog.Popup>, 'className' | 'title'>
    & VariantProps<typeof sheetRecipe>
    & {
      children: ReactNode;
      className?: string;
      description: string;
      title: string;
    };

export function Sheet(props: ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />;
}

export function SheetTrigger(props: ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />;
}

export function SheetClose(props: ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close {...props} />;
}

export function SheetContent({ children, className, description, side, title, ...props }: SheetContentProps) {
  const styles = sheetRecipe({ side });

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.backdrop()} />
      <Dialog.Viewport className={styles.viewport()}>
        <Dialog.Popup {...props} className={styles.popup({ className })}>
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Description className="sr-only">{description}</Dialog.Description>
          {children}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  );
}
