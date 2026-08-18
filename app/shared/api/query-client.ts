import { QueryClient } from '@tanstack/react-query';
import { isHTTPError } from 'ky';
import { ApiContractError } from './errors';

let browserQueryClient: QueryClient | undefined;

const DEFAULT_STALE_TIME_MS = 10 * 60 * 1000;
const MAX_RETRIES = 2;

function isPermanentFailure(error: Error): boolean {
  return isHTTPError(error)
    && error.response.status >= 400
    && error.response.status < 500;
}

function retry(failureCount: number, error: Error): boolean {
  if (error instanceof ApiContractError) {
    return false;
  }

  if (isPermanentFailure(error)) {
    return false;
  }

  return failureCount < MAX_RETRIES;
}

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

export function getQueryClient(): QueryClient {
  if (import.meta.env.SSR) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
