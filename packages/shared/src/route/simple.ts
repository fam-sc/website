import { methodNotAllowed, notFound } from '../responses';
import { HttpMethod } from './types';

export type RouteHandler<Env> = (
  request: Request,
  env: Env
) => Promise<Response>;

export type Route<Env> = Partial<Record<HttpMethod, RouteHandler<Env>>>;

export type RouteMap<Env> = Record<string, Route<Env> | undefined>;

export function handleRoute<Env>(
  request: Request,
  env: Env,
  routeMap: RouteMap<Env>
): Promise<Response> {
  const { pathname } = new URL(request.url);

  const route = routeMap[pathname];
  if (route !== undefined) {
    const handler = route[request.method as keyof Route<Env>];

    return handler
      ? handler(request, env)
      : Promise.resolve(methodNotAllowed(Object.keys(request.method)));
  }

  return Promise.resolve(notFound());
}
