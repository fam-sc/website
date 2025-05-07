import { TelegramBot } from '@/telegram';
import { getEnvChecked } from '@shared/env';
import { loadEnvFile } from 'node:process';

async function main() {
  loadEnvFile('./.env.local');

  const client = new TelegramBot(getEnvChecked('BOT_KEY'));
  const result = await client.setWebhook(
    'https://schedule-bot.sc-fam.org/update',
    getEnvChecked('BOT_SECRET_TOKEN')
  );

  console.log(result);
}

void main();
