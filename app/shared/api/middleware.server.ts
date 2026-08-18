import type { MiddlewareFunction } from 'react-router';
import type { Api } from './contracts';
import { createContext } from 'react-router';
import { createApi, kyInstance } from './api';

export const ServerApiContext = createContext<Api>();

export const apiMiddleware: MiddlewareFunction<Response> = ({ request, context }, next) => {
  const cookie = request.headers.get('cookie');
  const client = cookie ? kyInstance.extend({ headers: { cookie } }) : kyInstance;

  context.set(ServerApiContext, createApi(client));

  return next();
};
