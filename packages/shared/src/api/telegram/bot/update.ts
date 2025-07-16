import { bot } from 'telegram-standard-bot-api';
import { Update } from 'telegram-standard-bot-api/types';

import { badRequest } from '../../../responses';
import { getApiSecretToken } from '../request';

type Env = {
  BOT_SECRET_TOKEN: string;
  BOT_KEY: string;
};

export function bootstrapHandleUpdate(
  handleUpdate: (update: Update) => Promise<void>
) {
  return async (request: Request, { env }: { env: Env }) => {
    const secretToken = getApiSecretToken(request);
    if (secretToken !== env.BOT_SECRET_TOKEN) {
      return badRequest();
    }

    const update = (await request.json()) as Update;

    bot.setApiKey(env.BOT_KEY);
    await handleUpdate(update);

    return new Response();
  };
}
