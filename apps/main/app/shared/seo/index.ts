import type { MetaDescriptor } from 'react-router';

const SITE_NAME = 'popn.gg';

/** Suffixes a route title with the site name, for use in a route's `meta` export. */
export function pageTitle(title: string) {
  return `${title} / ${SITE_NAME}`;
}

/** `og:image` tags for a route's `meta` export. `url` must be absolute — crawlers fetch it directly. */
export function ogImage({ url, alt }: { url: string; alt?: string }): MetaDescriptor[] {
  return [
    { property: 'og:image', content: url },
    ...(alt ? [{ property: 'og:image:alt', content: alt }] : []),
  ];
}
