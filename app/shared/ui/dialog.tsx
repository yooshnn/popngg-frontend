import type { ComponentProps, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { tv } from 'tailwind-variants';

const dialogRecipe = tv({
  slots: {
    backdrop: 'fixed inset-0 z-40 bg-bg-neutral-solid/25 backdrop-blur-[1px] transition-opacity duration-150 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none',
    viewport: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    popup: [
      'flex max-h-[calc(100dvh-2rem)] w-full scale-100 flex-col rounded-2xl border border-stroke-neutral-weak bg-bg-layer-default shadow-s3 outline-none',
      'transition-[scale,opacity] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none',
    ],
  },
  variants: {
    size: {
      default: { popup: 'max-w-[32rem]' },
      wide: { popup: 'max-w-[44rem]' },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type DialogContentProps
  = Omit<ComponentProps<typeof DialogPrimitive.Popup>, 'className' | 'title'>
    & VariantProps<typeof dialogRecipe>
    & {
      children: ReactNode;
      className?: string;
      description?: string;
      title: string;
    };

export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

export function DialogContent({
  children,
  className,
  description,
  size,
  title,
  ...props
}: DialogContentProps) {
  const styles = dialogRecipe({ size });

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className={styles.backdrop()} />
      <DialogPrimitive.Viewport className={styles.viewport()}>
        <DialogPrimitive.Popup {...props} className={styles.popup({ className })}>
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          {description
            ? <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
            : null}
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}
