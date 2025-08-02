import { UserRole } from '@sc-fam/data';
import { ok } from '@sc-fam/shared';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';
import { ZodMiniType } from 'zod/v4-mini';

import { getBotFlow, saveBotFlow, saveBotFlowMeta } from '@/api/botFlow';
import { botFlowInMeta, botFlowWithInMeta } from '@/api/botFlow/schema';

import { app } from '../app';
import { auth } from '../authRoute';

app.get(
  '/botFlow',
  middlewareHandler(auth({ minRole: UserRole.ADMIN }), async ({ env }) => {
    const flow = await getBotFlow(env);

    return ok(flow);
  })
);

function putRoute<T>(
  path: string,
  schema: ZodMiniType<T>,
  operation: (env: Env, value: T) => Promise<void>
) {
  app.put(
    path,
    middlewareHandler(
      zodSchema(schema),
      auth({ minRole: UserRole.ADMIN }),
      async ({ env, data: [payload] }) => {
        await operation(env, payload);

        return new Response();
      }
    )
  );
}

putRoute('/botFlow', botFlowWithInMeta, saveBotFlow);
putRoute('/botFlow/meta', botFlowInMeta, saveBotFlowMeta);
