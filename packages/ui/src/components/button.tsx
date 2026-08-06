import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { Button as BaseButton } from '@base-ui/react/button';
import { LoaderCircleIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

const buttonRecipe = tv({
  base: [
    'relative inline-flex cursor-pointer items-center justify-center rounded-lg border border-transparent font-medium whitespace-nowrap select-none active:rounded-xl',
    'transition-[background-color,border-color,color,border-radius] ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring',
    'data-disabled:pointer-events-none disabled-idle:text-fg-disabled',
  ],
  variants: {
    variant: {
      'neutral-solid': 'bg-bg-neutral-solid text-fg-neutral-inverted hover:bg-bg-neutral-solid-hover disabled-idle:bg-bg-disabled',
      'neutral-weak': 'bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-hover disabled-idle:bg-bg-disabled',
      'neutral-outline': 'border-stroke-neutral-weak bg-transparent text-fg-neutral-muted hover:bg-bg-neutral-weak disabled-idle:border-stroke-neutral-muted',
      'neutral-ghost': 'text-fg-neutral-muted hover:bg-bg-neutral-weak',
      'brand-solid': 'bg-bg-brand-solid text-fg-neutral-inverted hover:bg-bg-brand-solid-hover disabled-idle:bg-bg-disabled',
      'brand-weak': 'bg-bg-brand-weak text-fg-brand hover:bg-bg-brand-weak-hover disabled-idle:bg-bg-disabled',
      'brand-outline': 'border-stroke-neutral-weak bg-transparent text-fg-brand hover:bg-bg-neutral-weak disabled-idle:border-stroke-neutral-muted',
      'brand-ghost': 'text-fg-brand hover:bg-bg-neutral-weak',
      'critical-solid': 'bg-bg-critical-solid text-fg-neutral-inverted hover:bg-bg-critical-solid-hover disabled-idle:bg-bg-disabled',
      'critical-weak': 'bg-bg-critical-weak text-fg-critical hover:bg-bg-critical-weak-hover disabled-idle:bg-bg-disabled',
      'critical-outline': 'border-stroke-neutral-weak bg-transparent text-fg-critical hover:bg-bg-neutral-weak disabled-idle:border-stroke-neutral-muted',
      'critical-ghost': 'text-fg-critical hover:bg-bg-neutral-weak',
    },
    size: {
      sm: 'h-9 text-sm',
      md: 'h-10 text-sm',
      lg: 'h-11 text-base',
    },
    layout: {
      withText: '',
      iconOnly: 'p-0',
    },
    width: {
      fit: 'w-fit',
      full: 'w-full',
    },
  },
  compoundVariants: [
    { layout: 'withText', size: 'sm', class: 'px-3' },
    { layout: 'withText', size: 'md', class: 'px-4' },
    { layout: 'withText', size: 'lg', class: 'px-5' },
    { layout: 'iconOnly', size: 'sm', class: 'w-9' },
    { layout: 'iconOnly', size: 'md', class: 'w-10' },
    { layout: 'iconOnly', size: 'lg', class: 'w-11' },
  ],
  defaultVariants: {
    variant: 'neutral-weak',
    size: 'md',
    layout: 'withText',
    width: 'fit',
  },
});

export type ButtonStyleProps
  = Omit<VariantProps<typeof buttonRecipe>, 'layout'>
    & { className?: string };

/** Returns Button visual styles for semantic links such as `<a>` and router links. */
export function buttonStyles({
  variant,
  size,
  width,
  className,
}: ButtonStyleProps = {}) {
  return buttonRecipe({ variant, size, width, layout: 'withText', className });
}

const iconStyles = tv({
  base: 'inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-4',
      lg: 'size-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ButtonProps
  = Omit<BaseButton.Props, 'className'>
    & Omit<ButtonStyleProps, 'className'>
    & {
      className?: string;
      loading?: boolean;
      prefixIcon?: ReactNode;
      suffixIcon?: ReactNode;
    };

export type IconButtonProps
  = Omit<BaseButton.Props, 'aria-label' | 'children' | 'className'>
    & Omit<VariantProps<typeof buttonRecipe>, 'layout' | 'width'>
    & {
      'aria-label': string;
      'children': ReactNode;
      'className'?: string;
      'loading'?: boolean;
    };

export function Button({
  variant,
  size,
  width,
  prefixIcon,
  suffixIcon,
  loading = false,
  disabled = false,
  focusableWhenDisabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isLoading = loading && !disabled;

  return (
    <BaseButton
      {...props}
      aria-busy={isLoading || undefined}
      className={buttonStyles({ variant, size, width, className })}
      data-loading={isLoading ? '' : undefined}
      disabled={disabled || isLoading}
      focusableWhenDisabled={isLoading || focusableWhenDisabled}
    >
      {isLoading && <LoaderCircleIcon aria-hidden="true" className={iconStyles({ size, className: 'absolute inset-0 m-auto animate-spin' })} />}
      <span className={isLoading ? 'inline-flex items-center gap-1.5 opacity-0' : 'inline-flex items-center gap-1.5'}>
        {prefixIcon && <span className={iconStyles({ size })} aria-hidden="true">{prefixIcon}</span>}
        {children}
        {suffixIcon && <span className={iconStyles({ size })} aria-hidden="true">{suffixIcon}</span>}
      </span>
    </BaseButton>
  );
}

export function IconButton({
  'aria-label': ariaLabel,
  variant,
  size,
  loading = false,
  disabled = false,
  focusableWhenDisabled,
  className,
  children,
  ...props
}: IconButtonProps) {
  const isLoading = loading && !disabled;

  return (
    <BaseButton
      {...props}
      aria-busy={isLoading || undefined}
      aria-label={ariaLabel}
      className={buttonRecipe({ variant, size, layout: 'iconOnly', className })}
      data-loading={isLoading ? '' : undefined}
      disabled={disabled || isLoading}
      focusableWhenDisabled={isLoading || focusableWhenDisabled}
    >
      {isLoading && <LoaderCircleIcon aria-hidden="true" className={iconStyles({ size, className: 'absolute inset-0 m-auto animate-spin' })} />}
      <span className={iconStyles({ size, className: isLoading ? 'opacity-0' : undefined })} aria-hidden="true">
        {children}
      </span>
    </BaseButton>
  );
}
