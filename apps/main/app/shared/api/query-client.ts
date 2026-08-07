import { QueryClient } from '@tanstack/react-query';
import { isHTTPError } from 'ky';

let browserQueryClient: QueryClient | undefined;

const DEFAULT_STALE_TIME_MS = 60 * 1000;

const MAX_RETRIES = 2;

/** The request itself is wrong — bad credentials, failed validation, missing resource. */
function isPermanentFailure(error: Error): boolean {
  return isHTTPError(error)
    && error.response.status >= 400
    && error.response.status < 500;
}

function retry(failureCount: number, error: Error): boolean {
  if (isPermanentFailure(error)) {
    return false;
  }
  return failureCount < MAX_RETRIES;
}

/**
 * @remarks Retries are browser-only. `prefetchQuery` inherits whatever `retry`
 * the client carries — react-query's own `retry: false` fallback only applies
 * when the option is left undefined — so a retrying server client would hold
 * the SSR response through the full backoff, then swallow the failure anyway
 * and leave the browser to fetch it again.
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        retry: import.meta.env.SSR ? false : retry,
      },
    },
  });
}

/**
 * Returns the `QueryClient` for the current environment.
 *
 * @remarks On the server, returns a fresh instance per call — never memoize
 * here, since a module-level singleton would leak cache across requests. In
 * the browser, returns a shared module-level singleton.
 */
export function getQueryClient(): QueryClient {
  if (import.meta.env.SSR) {
    return createQueryClient();
  }
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
