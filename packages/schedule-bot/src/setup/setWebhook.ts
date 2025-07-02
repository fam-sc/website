import { TelegramBot } from '@shared/api/telegram';
import { getEnvChecked } from '@shared/env';
import { config } from 'dotenv';

async function main() {
  config({ path: '.env.local', quiet: true });

  const client = new TelegramBot(getEnvChecked('BOT_KEY'));
  const result = await client.setWebhook(
    'https://schedule-bot.sc-fam.org/update',
    getEnvChecked('BOT_SECRET_TOKEN')
  );

  console.log(result);
}

void main();
