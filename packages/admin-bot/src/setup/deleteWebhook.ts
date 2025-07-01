import { TelegramBot } from '@shared/api/telegram';
import { getEnvChecked } from '@shared/env';
import { config } from 'dotenv';

async function main() {
  config({ path: '.env.local', quiet: true });

  const client = new TelegramBot(getEnvChecked('BOT_KEY'));
  await client.deleteWebhook();
}

void main();
