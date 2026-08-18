import type { ButtonProps } from '~/shared/ui/button';
import { Button } from '~/shared/ui/button';

export type ToggleButtonProps = Omit<ButtonProps, 'variant' | 'width'>;

export function ToggleButton({ className = '', size = 'sm', type = 'button', ...props }: ToggleButtonProps) {
  return (
    <Button
      className={`rounded-none font-normal focus-visible:-outline-offset-2 w-32 ${className}`}
      size={size}
      type={type}
      variant="neutral-ghost"
      {...props}
    />
  );
}
