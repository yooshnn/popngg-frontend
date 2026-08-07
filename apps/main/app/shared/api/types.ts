import type { RouterContextProvider } from 'react-router';

export type ApiVersion = 'v1';

export interface HttpOptions {
  /**
   * Server loader/action context. When provided, requests use that request's
   * cookie-bound instance from `ServerApiContext`; when omitted, they use the
   * shared browser `kyInstance`.
   */
  context?: Readonly<RouterContextProvider>;
  version?: ApiVersion;
}

export interface Envelope<T> {
  data: T;
  message?: string;
}

export interface Page<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}
