import type { MiddlewareFunction } from 'react-router';
import { ServerApiContext } from './context';
import { kyInstance } from './http';

/**
 * Per-request ky instance middleware.
 *
 * `apiMiddleware` must be registered on `root.tsx`; downstream `loader`s read
 * the request's instance with `http({ context })`.
 */
export const apiMiddleware: MiddlewareFunction<Response> = ({ request, context }, next) => {
  const cookie = request.headers.get('cookie');

  context.set(ServerApiContext, cookie ? kyInstance.extend({ headers: { cookie } }) : kyInstance);

  return next();
};
