import type { KyInstance } from 'ky';
import { createContext } from 'react-router';

/**
 * Per-request ky instance, set by `apiMiddleware` with the incoming `Cookie`
 * header attached. Requires `apiMiddleware` to be registered on the route
 * (see `root.tsx`) — a missing middleware throws here immediately instead
 * of silently sending a cookieless request.
 */
export const ServerApiContext = createContext<KyInstance>();
