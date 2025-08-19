import { createRequestHandler } from 'react-router';

import {
  handleCampaignRequest,
  handleRegistrationClickRequest,
} from './api/campaign';

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

    if (request.method === 'POST') {
      if (pathname === '/api/campaign') {
        return handleCampaignRequest(request, env);
      } else if (pathname === `/api/registration-click`) {
        return handleRegistrationClickRequest(request, env);
      }
    }

    return requestHandler(request, {
      cloudflare: { env },
    });
  },
} satisfies ExportedHandler<Env>;
