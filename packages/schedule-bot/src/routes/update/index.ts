import { BotController } from '@/controller';
import { badRequest } from '@/responses';
import { Update } from '@/telegram/types';

export async function POST(request: Request, env: Env): Promise<Response> {
  const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
  if (secretToken !== env.BOT_SECRET_TOKEN) {
    return badRequest();
  }

  const controller = new BotController(env);
  const update = await request.json<Update>();

  await controller.handleUpdate(update);

  return new Response();
}

export default { POST };
