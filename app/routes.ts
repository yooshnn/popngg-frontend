import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/app/route.tsx', [
    index('routes/home.tsx'),
    route('user/:userId', 'routes/user/route.tsx', [
      index('routes/user.home/route.tsx'),
      route('records', 'routes/user.records/route.tsx'),
      route('progress', 'routes/user.progress/route.tsx'),
    ]),
    route('renew', 'routes/renew/route.tsx'),
    route('users', 'routes/users/route.tsx'),
    route('*', 'routes/not-found/route.tsx'),
  ]),
  { path: 'login', file: 'routes/login/route.tsx' },
  { path: 'renew/handoff', file: 'routes/renew.handoff/route.tsx' },
] satisfies RouteConfig;
