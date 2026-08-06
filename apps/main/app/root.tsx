import type { Route } from './+types/root';
import { useTranslation } from 'react-i18next';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { i18nextMiddleware } from '~/shared/i18n/middleware';
import './app.css';

export const middleware: Route.MiddlewareFunction[] = [i18nextMiddleware];

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details
      = error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  }
  else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
