import { methodNotAllowed, notFound } from '@/responses';

export type RouteHandler<Env> = (
  request: Request,
  env: Env
) => Promise<Response>;

export type Route<Env> = Partial<
  Record<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', RouteHandler<Env>>
>;

export type RouteMap<Env> = Record<string, Route<Env> | undefined>;

export function handleRoute<Env>(
  request: Request,
  env: Env,
  routeMap: RouteMap<Env>
) {
  const { pathname } = new URL(request.url);

  const route = routeMap[pathname];
  if (route !== undefined) {
    const handler = route[request.method as keyof Route<Env>];

    return handler
      ? handler(request, env)
      : methodNotAllowed(Object.keys(request.method));
  }

  return notFound();
}
