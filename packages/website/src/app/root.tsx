import '@/theme/global.scss';

import { NotificationWrapper } from '@sc-fam/shared-ui';
import * as Sentry from '@sentry/react-router';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';

import { getSessionId } from '@/api/auth';
import type { UserWithRoleAndAvatar } from '@/api/users/types';
import { AuthProvider } from '@/auth/context';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { TurnstileScript } from '@/components/TurnstileScript';
import { Typography } from '@/components/Typography';
import { backgroundColor } from '@/theme';
import { repository } from '@/utils/repo';

import type { Route } from './+types/root';
import { getMinRoleForRoute } from './permissions';

export const links: Route.LinksFunction = () => [
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon-96x96.png',
    sizes: '96x96',
  },
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionId = getSessionId(request);
  let user: UserWithRoleAndAvatar | null = null;

  if (sessionId !== undefined) {
    const repo = repository(context);

    user = await repo.sessions().getUserWithRole(sessionId);
  }

  const { pathname } = new URL(request.url);
  const minRole = getMinRoleForRoute(pathname);
  if (minRole !== null && (user === null || user.role < minRole)) {
    return redirect('/');
  }

  return { user };
}

export function Layout({
  children,
}: Route.ComponentProps & { children: React.ReactNode }) {
  const { user } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="СР ФПМ" />
        <meta name="theme-color" content={backgroundColor} />
        <meta name="color-scheme" content="dark" />
        <meta property="og:locale" content="uk_UA" />
        <meta property="og:site_name" content="Студрада ФПМ" />

        <Meta />
        <Links />
        <TurnstileScript />
      </head>
      <body>
        <NotificationWrapper typography={Typography}>
          <AuthProvider value={{ user }}>
            <Header />
            <main>{children}</main>

            <Footer />
          </AuthProvider>
        </NotificationWrapper>

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
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (error && error instanceof Error) {
    // you only want to capture non 404-errors that reach the boundary
    Sentry.captureException(error);

    if (import.meta.env.DEV) {
      details = error.message;
      stack = error.stack;
    }
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
