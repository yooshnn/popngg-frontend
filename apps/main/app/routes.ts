import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/app-layout.tsx', [
    index('routes/home.tsx'),
  ]),
  route('login', 'routes/login.tsx'),
] satisfies RouteConfig;
