import { config } from 'dotenv';
import { bot } from 'telegram-standard-bot-api';
import { deleteWebhook, setWebhook } from 'telegram-standard-bot-api/methods';

import { getEnvChecked } from '../../../env';

export async function runDeleteWebhook() {
  config({ path: '.env.local', quiet: true });

  bot.setApiKey(getEnvChecked('BOT_KEY'));
  await bot(deleteWebhook());
}

export async function runSetWebhook(url: string) {
  config({ path: '.env.local', quiet: true });

  bot.setApiKey(getEnvChecked('BOT_KEY'));
  await bot(
    setWebhook({
      url,
      secret_token: getEnvChecked('BOT_SECRET_TOKEN'),
    })
  );
}
