import type { CSSProperties, ReactNode } from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

const checkboxRecipe = tv({
  slots: {
    label: 'inline-flex min-h-8 items-center gap-2 rounded px-1 text-sm font-medium text-fg-neutral-muted transition-colors',
    box: [
      'relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-stroke-neutral-muted bg-bg-layer-default text-fg-neutral-inverted outline-none',
      'transition-[background-color,border-color,box-shadow]',
      'data-checked:border-[var(--checkbox-checked-color)] data-checked:bg-[var(--checkbox-checked-color)]',
      'data-disabled:border-stroke-neutral-subtle data-disabled:bg-bg-disabled',
      'data-focused:outline-2 data-focused:outline-offset-2 data-focused:outline-stroke-focus-ring',
    ],
  },
  variants: {
    disabled: {
      true: { label: 'cursor-not-allowed text-fg-disabled' },
      false: { label: 'cursor-pointer hover:bg-bg-neutral-weak hover:text-fg-neutral active:bg-bg-neutral-weak-hover' },
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

type CheckedColorStyle = CSSProperties & {
  '--checkbox-checked-color': string;
};

export type CheckboxProps
  = Omit<CheckboxPrimitive.Root.Props, 'children' | 'className' | 'render' | 'style'>
    & {
      children: ReactNode;
      accessibleLabel?: string;
      checkedColor?: string;
      className?: string;
    };

export function Checkbox({
  accessibleLabel,
  checkedColor = 'var(--color-bg-brand-solid)',
  className,
  children,
  disabled = false,
  indeterminate,
  ...props
}: CheckboxProps) {
  const styles = checkboxRecipe({ disabled });
  const style: CheckedColorStyle = { '--checkbox-checked-color': checkedColor };

  return (
    <label className={styles.label({ className })}>
      <CheckboxPrimitive.Root
        {...props}
        className={styles.box()}
        disabled={disabled}
        indeterminate={indeterminate}
        style={style}
      >
        <CheckboxPrimitive.Indicator className="flex size-full items-center justify-center">
          {indeterminate
            ? <MinusIcon aria-hidden="true" className="size-3 stroke-[2.5]" />
            : <CheckIcon aria-hidden="true" className="size-3 stroke-[2.5]" />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span aria-hidden={accessibleLabel ? 'true' : undefined} className="whitespace-nowrap">{children}</span>
      {accessibleLabel && <span className="sr-only">{accessibleLabel}</span>}
    </label>
  );
}
