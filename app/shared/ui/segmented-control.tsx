import type { ReactNode } from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { CheckIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

const segmentedControlStyles = tv({
  slots: {
    root: 'inline-flex h-9 overflow-hidden rounded-md border border-stroke-neutral-weak bg-bg-layer-default',
    item: [
      'inline-flex h-full min-w-12 items-center justify-center gap-1 border-l border-stroke-neutral-weak px-2.5 text-xs font-medium text-fg-neutral-muted select-none first:border-l-0',
      'transition-colors hover:bg-bg-neutral-weak hover:text-fg-neutral',
      'data-pressed:bg-bg-neutral-weak-hover data-pressed:text-fg-neutral data-pressed:hover:bg-bg-neutral-weak-hover',
      'data-disabled:pointer-events-none data-disabled:text-fg-disabled',
      'focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring',
    ],
  },
});

export interface SegmentedControlOption<Value extends string> {
  disabled?: boolean;
  label: ReactNode;
  value: Value;
}

export interface SegmentedControlProps<Value extends string> {
  'aria-label': string;
  'className'?: string;
  'disabled'?: boolean;
  'onValueChange': (value: Value) => void;
  'options': readonly SegmentedControlOption<Value>[];
  'value': Value;
}

/** A connected, single-select control for switching between related views. */
export function SegmentedControl<Value extends string>({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onValueChange,
  options,
  value,
}: SegmentedControlProps<Value>) {
  const styles = segmentedControlStyles();

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
          {option.value === value && <CheckIcon aria-hidden="true" className="size-3.5 stroke-2" />}
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
