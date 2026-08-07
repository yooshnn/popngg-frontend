import type { KyInstance } from 'ky';
import { createContext } from 'react-router';

/**
 * React Router context token carrying the current request's ky instance.
 *
 * `apiMiddleware` sets this once per request, extending the instance with the
 * incoming `Cookie` header so downstream `loader`s issue authenticated requests
 * without threading the header manually.
 *
 * @remarks No default value is provided. Reading this context before it has
 * been set throws immediately, rather than silently issuing a cookieless
 * request.
 */
export const ServerApiContext = createContext<KyInstance>();
