import type { Options } from 'ky';
import type { Envelope, HttpOptions } from './types';
import ky, { isHTTPError } from 'ky';
import { z } from 'zod';
import { ServerApiContext } from './context';

const API_ROOT = 'api';

const envelopeSchema = z.object({ data: z.unknown() });

const baseUrl: string | undefined = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error('API_BASE_URL is not set.');
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
 * Builds a request function that unwraps the envelope response. Pass `context`
 * in a server loader/action to use that request's cookie-carrying instance;
 * omit it in the browser to use the shared `kyInstance`.
 */
export function http({ context, version = 'v1' }: HttpOptions = {}) {
  const client = context ? context.get(ServerApiContext) : kyInstance;

  return async <T>(url: string, options?: Options): Promise<T> => {
    const response = await client(joinPath(API_ROOT, version, url), options);

    const envelope = envelopeSchema.parse(await response.json(), {
      error: () => `${response.url} answered ${response.status} without an envelope`,
    });

    return envelope.data as T;
  };
}

// Utils

/**
 * Surfaces the backend's `message` as the thrown error's message. Reads
 * `error.data`, not `error.response` — ky already consumed the body by the
 * time this hook runs, so the response can't be read again.
 */
function normalizeError({ error }: { error: Error }) {
  if (!isHTTPError(error)) {
    return error;
  }

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
