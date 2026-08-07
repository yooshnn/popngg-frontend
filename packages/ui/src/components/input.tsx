import type { ComponentProps, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const inputRecipe = tv({
  base: [
    'h-12 w-full rounded-lg border border-stroke-neutral-weak bg-bg-layer-default text-base text-fg-neutral outline-none',
    'transition-[border-color,box-shadow] placeholder:text-fg-placeholder',
    'focus:border-transparent focus:ring-2 focus:ring-stroke-focus-ring',
    'disabled:border-stroke-neutral-subtle disabled:bg-bg-disabled disabled:text-fg-disabled',
  ],
  variants: {
    hasPrefix: {
      true: 'pl-12',
      false: 'pl-4',
    },
    hasSuffix: {
      true: 'pr-12',
      false: 'pr-4',
    },
  },
  defaultVariants: {
    hasPrefix: false,
    hasSuffix: false,
  },
});

export type InputStyleProps
  = VariantProps<typeof inputRecipe>
    & { className?: string };

/** Returns Input visual styles for native controls that share the text field shape, such as `<select>`. */
export function inputStyles({ hasPrefix, hasSuffix, className }: InputStyleProps = {}) {
  return inputRecipe({ hasPrefix, hasSuffix, className });
}

export type InputProps
  = Omit<ComponentProps<'input'>, 'className' | 'prefix'>
    & {
      className?: string;
      /** Decorative icon pinned to the left edge. Set its own text color to react to state. */
      prefixIcon?: ReactNode;
      /** Node pinned to the right edge. Stays interactive, so a reveal or clear button belongs here. */
      suffix?: ReactNode;
    };

export function Input({ className, prefixIcon, suffix, ...props }: InputProps) {
  return (
    <div className="relative">
      {prefixIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 flex size-5 -translate-y-1/2 items-center justify-center text-fg-placeholder transition-colors [&>svg]:size-full"
        >
          {prefixIcon}
        </span>
      )}
      <input
        {...props}
        className={inputStyles({ hasPrefix: Boolean(prefixIcon), hasSuffix: Boolean(suffix), className })}
      />
      {suffix && <span className="absolute top-1/2 right-2 -translate-y-1/2">{suffix}</span>}
    </div>
  );
}
