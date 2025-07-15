import { AppLoadContext } from 'react-router';

export function getApiEnv(loadContext: AppLoadContext): Env {
  return loadContext.cloudflare.env;
}
