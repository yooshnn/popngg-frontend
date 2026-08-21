import type { ReactNode } from 'react';

export interface PageHeaderProps {
  description?: ReactNode;
  title: ReactNode;
  titleId: string;
}

export function PageHeader({ description, title, titleId }: PageHeaderProps) {
  return (
    <header className="max-w-[650px]">
      <h1 className="text-[2rem] leading-tight font-bold tracking-[-.04em] md:text-4xl" id={titleId}>{title}</h1>
      {description && <p className="mt-3 text-sm leading-6 text-fg-neutral-muted">{description}</p>}
    </header>
  );
}
