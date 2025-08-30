import './api/routes';

import { setDefaultDatabase } from '@sc-fam/shared-sql/repo';
import { createRequestHandler } from 'react-router';

import { app } from './api/app';

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

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    setDefaultDatabase(env.DB);

    if (pathname.startsWith('/api')) {
      return app.handleRequest(request, env);
    }

    return requestHandler(request, {
      cloudflare: { env },
    });
  },
} satisfies ExportedHandler<Env>;
