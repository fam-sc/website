import auth from './routes/auth';
import update from './routes/update';

type RouteHandler = (request: Request, env: Env) => Promise<Response>;

type Route = {
  GET?: RouteHandler;
  POST?: RouteHandler;
};

const routes: Record<string, Route | undefined> = {
  '/auth': auth,
  '/update': update,
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    const route = routes[pathname];
    if (route !== undefined) {
      const handler = route[request.method as keyof Route];
      if (handler === undefined) {
        return new Response('Method Not Allowed', { status: 405 });
      }

      return handler(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
