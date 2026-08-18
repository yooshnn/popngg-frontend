import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/app/route.tsx', [
    index('routes/home.tsx'),
    route('*', 'routes/not-found/route.tsx'),
  ]),
  { path: 'login', file: 'routes/login/route.tsx' },
] satisfies RouteConfig;
