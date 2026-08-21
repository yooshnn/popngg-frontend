import type { ReactNode } from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { tv } from 'tailwind-variants';

const pillGroupStyles = tv({
  slots: {
    root: 'flex max-w-full flex-wrap items-center gap-1.5',
    item: [
      'inline-flex min-h-8 items-center justify-center rounded-full px-3 text-xs font-medium select-none',
      'bg-bg-neutral-weak text-fg-neutral-muted transition-colors',
      'hover:bg-bg-neutral-weak-hover hover:text-fg-neutral',
      'data-pressed:bg-bg-neutral-solid data-pressed:text-fg-neutral-inverted data-pressed:hover:bg-bg-neutral-solid-hover',
      'data-disabled:pointer-events-none data-disabled:bg-bg-neutral-weak data-disabled:text-fg-disabled',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring',
    ],
  },
});

export interface PillGroupOption<Value extends string> {
  disabled?: boolean;
  label: ReactNode;
  value: Value;
}

export interface PillGroupProps<Value extends string> {
  'aria-label': string;
  'className'?: string;
  'disabled'?: boolean;
  'onValueChange': (value: Value) => void;
  'options': readonly PillGroupOption<Value>[];
  'value': Value;
}

/** A wrapping, single-select control for switching between many peer groupings. */
export function PillGroup<Value extends string>({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onValueChange,
  options,
  value,
}: PillGroupProps<Value>) {
  const styles = pillGroupStyles();

  function handleValueChange(values: Value[]) {
    const nextValue = values[0];
    if (nextValue)
      onValueChange(nextValue);
  }

  return (
    <ToggleGroup
      aria-label={ariaLabel}
      className={styles.root({ className })}
      disabled={disabled}
      value={[value]}
      onValueChange={handleValueChange}
    >
      {options.map(option => (
        <Toggle
          className={styles.item()}
          disabled={option.disabled}
          key={option.value}
          type="button"
          value={option.value}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
