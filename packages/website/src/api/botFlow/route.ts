import { UserRole } from '@data/types/user';
import { badRequest, ok } from '@shared/responses';

import { getBotFlow, saveBotFlow, saveBotFlowMeta } from '@/api/botFlow';
import { botFlowInMeta, botFlowWithInMeta } from '@/botFlow/types';

import { app } from '../app';
import { authRoute } from '../authRoute';

app.get('/botFlow', async (request, { env }) => {
  return authRoute(request, UserRole.ADMIN, async () => {
    const flow = await getBotFlow(env);

    return ok(flow);
  });
});

app.put('/botFlow', async (request, { env }) => {
  return authRoute(request, UserRole.ADMIN, async () => {
    const rawFlow = await request.json();
    const flowResult = botFlowWithInMeta.safeParse(rawFlow);
    if (flowResult.error) {
      console.error(flowResult.error);
      return badRequest();
    }

    await saveBotFlow(env, flowResult.data);

    return new Response();
  });
});

app.put('/botFlow/meta', async (request, { env }) => {
  return authRoute(request, UserRole.ADMIN, async () => {
    const meta = await request.json();
    const metaResult = botFlowInMeta.safeParse(meta);
    if (metaResult.error) {
      console.error(metaResult.error);
      return badRequest();
    }

    await saveBotFlowMeta(env, metaResult.data);

    return new Response();
  });
});
