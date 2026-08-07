import type { ReactNode } from 'react';

export interface PageHeaderProps {
  description?: ReactNode;
  title: ReactNode;
  titleId: string;
}

/**
 * Renders a page's title and short description. Title areas with their own
 * composition, such as the home hero or a user profile, don't use this.
 */
export function PageHeader({ description, title, titleId }: PageHeaderProps) {
  return (
    <header className="max-w-[650px]">
      <h1 className="text-[2rem] leading-tight font-bold tracking-[-.04em] md:text-4xl" id={titleId}>{title}</h1>
      {description && <p className="mt-3 text-sm leading-6 break-keep text-fg-neutral-muted">{description}</p>}
    </header>
  );
}
