import { getEnvChecked } from '@shared/env';
import { config } from 'dotenv';

import { TelegramBot } from '@/telegram';

async function main() {
  config({ path: '.env.local', quiet: true });

  const client = new TelegramBot(getEnvChecked('BOT_KEY'));
  await client.deleteWebhook();
}

void main();
