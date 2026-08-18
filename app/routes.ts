import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout } from '@react-router/dev/routes';

export default [
  layout('routes/app/route.tsx', [
    index('routes/home.tsx'),
  ]),
  { path: 'login', file: 'routes/login/route.tsx' },
] satisfies RouteConfig;
