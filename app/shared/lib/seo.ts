const SITE_NAME = 'popn.gg';

/** Suffixes a route's own title with the site name. The landing page uses SITE_NAME alone. */
export function pageTitle(title: string): string {
  return `${title} / ${SITE_NAME}`;
}
