import type { ReactNode } from 'react';

export function RenewStep({ index, title, description, noteItems, children }: {
  index: number;
  title: string;
  description: ReactNode;
  noteItems?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-bg-brand-weak text-sm font-semibold text-fg-brand"
      >
        {index}
      </span>

      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1.5 text-sm leading-6 text-pretty text-fg-neutral-muted">{description}</p>
        {children && <div className="mt-4">{children}</div>}
        {noteItems && (
          <ul className="mt-3 list-disc pl-4 text-xs leading-5 text-pretty text-fg-neutral-subtle">
            {noteItems}
          </ul>
        )}
      </div>
    </li>
  );
}
