import type { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';

const setStyles = tv({
  base: 'flex min-w-0 flex-col gap-5',
});

const groupStyles = tv({
  base: 'group/field-group flex w-full flex-col gap-5',
});

const fieldStyles = tv({
  base: 'group/field flex w-full flex-col gap-1.5 [&>*]:w-full [&>.sr-only]:w-auto data-[invalid=true]:text-fg-critical',
});

const levelRecipe = tv({
  base: 'font-medium',
  variants: {
    variant: {
      legend: 'text-sm font-semibold tracking-[-.015em] text-fg-neutral',
      label: 'text-sm text-fg-neutral-muted',
      field: 'text-[.6875rem] leading-5 text-fg-neutral-subtle',
    },
  },
  defaultVariants: {
    variant: 'field',
  },
});

const labelStyles = tv({
  extend: levelRecipe,
  base: 'flex w-fit gap-2 group-data-[disabled=true]/field:opacity-50',
});

const descriptionStyles = tv({
  base: 'text-xs leading-5 font-normal text-fg-neutral-subtle',
});

const errorStyles = tv({
  base: 'text-xs leading-5 font-normal text-fg-critical',
});

export type FieldLevel = 'legend' | 'label' | 'field';

export type FieldLabelProps
  = ComponentProps<'label'>
    & { variant?: FieldLevel };

export type FieldLegendProps
  = ComponentProps<'legend'>
    & { variant?: Exclude<FieldLevel, 'field'> };

export function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return <fieldset {...props} data-slot="field-set" className={setStyles({ className })} />;
}

export function FieldLegend({ className, variant = 'legend', ...props }: FieldLegendProps) {
  return (
    <legend
      {...props}
      data-slot="field-legend"
      data-variant={variant}
      className={levelRecipe({ variant, className })}
    />
  );
}

export function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="field-group" className={groupStyles({ className })} />;
}

export function Field({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} role="group" data-slot="field" className={fieldStyles({ className })} />;
}

export function FieldLabel({ className, variant = 'field', ...props }: FieldLabelProps) {
  return (
    <label
      {...props}
      data-slot="field-label"
      data-variant={variant}
      className={labelStyles({ variant, className })}
    />
  );
}

export function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p {...props} data-slot="field-description" className={descriptionStyles({ className })} />;
}

export function FieldError({ children, className, ...props }: ComponentProps<'div'>) {
  if (!children) {
    return null;
  }

  return (
    <div {...props} role="alert" data-slot="field-error" className={errorStyles({ className })}>
      {children}
    </div>
  );
}
