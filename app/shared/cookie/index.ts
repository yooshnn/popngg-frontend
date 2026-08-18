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
 * Schema-validated cookie definition for SSR and browser use.
 * Missing or invalid values return `fallback`.
 * Secret-bearing definitions belong in `.server.ts` modules.
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
    /** Raw React Router cookie for adapters and Set-Cookie responses. */
    cookie,

    /** Fallback value for missing or invalid cookies. */
    fallback,

    /** Reads from a Request or document.cookie. */
    read: async (source: Request | string | null): Promise<T> => {
      const header = source instanceof Request ? source.headers.get('cookie') : source;

      return total.parse(await cookie.parse(header));
    },

    /** Browser-only write. */
    write: async (value: T) => {
      document.cookie = await cookie.serialize(value);
    },

    /** Browser-only clear. */
    clear: async () => {
      document.cookie = await cookie.serialize('', { maxAge: 0 });
    },
  };
}
