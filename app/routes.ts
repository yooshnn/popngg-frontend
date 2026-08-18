import type { RouteConfig } from '@react-router/dev/routes';
import { index } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  { path: 'login', file: 'routes/login/route.tsx' },
] satisfies RouteConfig;
