import type { CookieOptions } from 'react-router';
import type { ZodType } from 'zod';
import { createCookie } from 'react-router';

const baseOptions = {
  path: '/',
  sameSite: 'lax',
  secure: import.meta.env.PROD,
  maxAge: 60 * 60 * 24 * 365,
} satisfies CookieOptions;

/**
 * Defines a schema-validated cookie.
 *
 * `fallback` is returned whenever the cookie is absent, tampered with, or holds
 * a value the schema rejects — `read` never throws. Put `.catch()` on individual
 * object fields to keep a partially valid cookie's readable keys.
 */
export function defineCookie<T>({ name, schema, fallback, options }: {
  name: string;
  schema: ZodType<T>;
  fallback: T;
  options?: CookieOptions;
}) {
  const cookie = createCookie(name, { ...baseOptions, ...options });
  const total = schema.catch(fallback);

  return {
    /** Raw react-router cookie, for APIs that take a `Cookie` (e.g. remix-i18next detection). */
    cookie,

    /** Value used when the cookie is absent or unreadable. */
    fallback,

    /** Server: pass the `Request`. Browser: pass `document.cookie`. */
    read: async (source: Request | string | null): Promise<T> => {
      const header = source instanceof Request ? source.headers.get('cookie') : source;

      return total.parse(await cookie.parse(header));
    },

    /** Browser only — the server sets cookies through `Set-Cookie` instead. */
    write: async (value: T) => {
      document.cookie = await cookie.serialize(value);
    },

    /** Browser only. */
    clear: async () => {
      document.cookie = await cookie.serialize('', { maxAge: 0 });
    },
  };
}
