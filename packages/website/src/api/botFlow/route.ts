import { UserRole } from '@data/types/user';
import { ok } from '@shared/responses';

import { getBotFlow, saveBotFlow } from '@/api/botFlow';
import { BotFlowWithInMeta } from '@/botFlow/types';

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
    const flow = await request.json<BotFlowWithInMeta>();
    await saveBotFlow(env, flow);

    return new Response();
  });
});
