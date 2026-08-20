import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  action?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
  titleId: string;
}

/** Renders a section title, description, and an optional section-scoped action. */
export function SectionHeader({ action, description, title, titleId }: SectionHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="min-w-0 max-w-[650px] flex-1">
        <h2 className="text-2xl leading-tight font-bold tracking-[-.04em] md:text-3xl" id={titleId}>{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-fg-neutral-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0 self-end">{action}</div>}
    </header>
  );
}
