import { getEnvChecked } from '@shared/env';
import { config } from 'dotenv';
import { bot } from 'telegram-standard-bot-api';
import { setWebhook } from 'telegram-standard-bot-api/methods';

async function main() {
  config({ path: '.env.local', quiet: true });

  bot.setApiKey(getEnvChecked('BOT_KEY'));
  await bot(
    setWebhook({
      url: 'https://admin-bot.sc-fam.org/update',
      secret_token: getEnvChecked('BOT_SECRET_TOKEN'),
    })
  );
}

void main();
