import { Menu } from '@base-ui/react/menu';
import { CheckIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

const contentStyles = tv({
  base: 'z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-md border border-stroke-neutral-weak bg-bg-layer-floating py-1 shadow-s2 outline-none',
});

const itemStyles = tv({
  base: [
    'flex h-10 w-full cursor-default items-center gap-2.5 px-3 text-sm font-medium text-fg-neutral select-none',
    'data-highlighted:bg-bg-neutral-weak-hover',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring',
  ],
});

export type DropdownMenuContentProps
  = Omit<Menu.Popup.Props, 'className'>
    & Pick<Menu.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>
    & { className?: string };

export type DropdownMenuItemProps = Omit<Menu.Item.Props, 'className'> & { className?: string };

export type DropdownMenuRadioItemProps = Omit<Menu.RadioItem.Props, 'className'> & { className?: string };

export function DropdownMenu(props: Menu.Root.Props) {
  return <Menu.Root {...props} />;
}

export function DropdownMenuTrigger(props: Menu.Trigger.Props) {
  return <Menu.Trigger {...props} />;
}

export function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  className,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <Menu.Popup {...props} className={contentStyles({ className })} />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function DropdownMenuGroup(props: Menu.Group.Props) {
  return <Menu.Group {...props} />;
}

export function DropdownMenuRadioGroup(props: Menu.RadioGroup.Props) {
  return <Menu.RadioGroup {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: Menu.Separator.Props) {
  return <Menu.Separator {...props} className={`mx-1 my-1 h-px bg-stroke-neutral-weak ${className ?? ''}`} />;
}

export function DropdownMenuItem({ className, ...props }: DropdownMenuItemProps) {
  return <Menu.Item {...props} className={itemStyles({ className })} />;
}

export function DropdownMenuRadioItem({ children, className, ...props }: DropdownMenuRadioItemProps) {
  return (
    <Menu.RadioItem {...props} className={itemStyles({ className: `relative pr-9 ${className ?? ''}` })}>
      {children}
      <Menu.RadioItemIndicator className="pointer-events-none absolute right-3 text-fg-neutral">
        <CheckIcon aria-hidden="true" className="size-4" />
      </Menu.RadioItemIndicator>
    </Menu.RadioItem>
  );
}
