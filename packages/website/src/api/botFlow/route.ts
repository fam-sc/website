import { UserRole } from '@data/types/user';
import { badRequest, ok } from '@shared/responses';
import { ZodMiniType } from 'zod/v4-mini';

import { getBotFlow, saveBotFlow, saveBotFlowMeta } from '@/api/botFlow';
import { botFlowInMeta, botFlowWithInMeta } from '@/api/botFlow/schema';

import { app } from '../app';
import { authRoute } from '../authRoute';

app.get('/botFlow', async (request, { env }) => {
  return authRoute(request, UserRole.ADMIN, async () => {
    const flow = await getBotFlow(env);

    return ok(flow);
  });
});

function putRoute<T>(
  path: string,
  schema: ZodMiniType<T>,
  operation: (env: Env, value: T) => Promise<void>
) {
  app.put(path, async (request, { env }) => {
    return authRoute(request, UserRole.ADMIN, async () => {
      const body = await request.json();
      const bodyResult = schema.safeParse(body);
      if (bodyResult.error) {
        console.error(bodyResult.error);
        return badRequest();
      }

      await operation(env, bodyResult.data);

      return new Response();
    });
  });
}

putRoute('/botFlow', botFlowWithInMeta, saveBotFlow);
putRoute('/botFlow/meta', botFlowInMeta, saveBotFlowMeta);
