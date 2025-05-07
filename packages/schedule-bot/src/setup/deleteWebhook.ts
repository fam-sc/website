import { TelegramBot } from '@/telegram';
import { getEnvChecked } from '@shared/env';
import { loadEnvFile } from 'node:process';

async function main() {
  loadEnvFile('./.env.local');

  const client = new TelegramBot(getEnvChecked('BOT_KEY'));
  await client.deleteWebhook();
}

void main();
