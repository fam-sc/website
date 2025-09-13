import * as Sentry from '@sentry/cloudflare';
import { createRequestHandler } from 'react-router';

type HandlerWrap = (handler: ExportedHandler<Env>) => ExportedHandler<Env>;

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
);

const wrap: HandlerWrap =
  import.meta.env.MODE === 'production'
    ? (handler) => {
        return Sentry.withSentry((env) => ({ dsn: env.SENTRY_DSN }), handler);
      }
    : (handler) => {
        return handler;
      };

export default wrap({
  async fetch(request, env) {
    return requestHandler(request, {
      cloudflare: { env },
    });
  },
});
