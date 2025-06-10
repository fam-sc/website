import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import { AuthProvider } from '@/auth/context';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { NotificationWrapper } from '@/components/Notification';
import { backgroundColor } from '@/theme';

import '@/theme/global.scss';
import { UserWithRoleAndAvatar } from '@shared/api/user/types';
import { Repository } from '@data/repo';
import { getSessionIdNumber } from '@shared/api/auth';

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

export async function loader({ request }: Route.LoaderArgs) {
  const sessionId = getSessionIdNumber(request);
  let user: UserWithRoleAndAvatar | null = null;

  if (sessionId !== undefined) {
    await using repo = await Repository.openConnection();

    user = await repo.sessions().getUserWithRole(sessionId);
  }

  return { user };
}

export function Layout({
  children,
}: Route.ComponentProps & { children: React.ReactNode }) {
  console.log('layout');
  const { user } = useLoaderData();
  console.log(user);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="СР ФПМ" />
        <meta name="theme-color" content={backgroundColor} />
        <meta name="color-scheme" content="dark" />

        <Meta />
        <Links />
      </head>
      <body>
        <NotificationWrapper>
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
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
