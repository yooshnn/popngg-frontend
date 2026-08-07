import type { Options } from 'ky';
import type { Envelope, HttpOptions } from './types';
import ky, { isHTTPError } from 'ky';
import { ServerApiContext } from './context';

const API_ROOT = 'api';

const baseUrl: string | undefined = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error(
    'VITE_API_BASE_URL is not set. Copy apps/main/.env.example to apps/main/.env.',
  );
}

/**
 * Shared ky client for the browser. On the server, use the request-scoped
 * instance from `ServerApiContext` instead.
 */
export const kyInstance = ky.create({
  baseUrl,
  credentials: 'include',
  retry: 0,
  hooks: {
    beforeError: [normalizeError],
  },
});

/**
 * Builds a request function that unwraps the envelope response.
 *
 * @remarks Pass `context` inside a server loader/action to bind requests to that
 * request's cookie-carrying instance; omit it in the browser to use the shared
 * `kyInstance`.
 * @returns A function that performs the request and returns the unwrapped data.
 */
export function http({ context, version = 'v1' }: HttpOptions = {}) {
  const client = context ? context.get(ServerApiContext) : kyInstance;

  return async <T>(url: string, options?: Options): Promise<T> => {
    const response = await client(joinPath(API_ROOT, version, url), options);

    const text = await response.text();
    if (text === '') {
      return undefined as T;
    }

    return unwrap<T>(text, response);
  };
}

// Utils

/**
 * Pulls `data` out of the envelope.
 *
 * @remarks The value of `data` is trusted and never validated — that is the
 * backend's contract to keep. The envelope around it is not: a body that is not
 * JSON, or JSON without a `data` key, means something other than the API
 * answered (a proxy error page, a redirect to a login form), and returning
 * `undefined` typed as `T` would push that failure into an unrelated call site.
 * `{ data: null }` is a valid envelope and passes through.
 */
function unwrap<T>(text: string, response: Response): T {
  const preview = text.length > 120 ? `${text.slice(0, 120)}…` : text;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  }
  catch {
    throw new TypeError(`${response.url} answered ${response.status} with a non-JSON body: ${preview}`);
  }

  if (typeof parsed !== 'object' || parsed === null || !('data' in parsed)) {
    throw new TypeError(`${response.url} answered ${response.status} without an envelope: ${preview}`);
  }

  return (parsed as Envelope<T>).data;
}

/**
 * Surfaces the backend's `message` as the thrown error's message.
 *
 * @remarks Reads `error.data`, not `error.response`. ky consumes the body to
 * populate `data` before this hook runs, so the response can no longer be read —
 * going through it silently yields nothing and leaves ky's generic status text.
 */
function normalizeError({ error }: { error: Error }) {
  if (!isHTTPError(error)) {
    return error;
  }

  // `data` is a string for non-JSON responses and `undefined` when the body is
  // empty or unparseable, so neither is treated as a message.
  const { data } = error;
  const message = typeof data === 'object' && data !== null
    ? (data as Envelope<unknown>).message
    : undefined;

  if (message) {
    error.message = message;
  }

  return error;
}

function joinPath(...segments: string[]): string {
  return segments
    .map(segment => segment.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
}
