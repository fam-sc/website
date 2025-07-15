import { getEnvChecked } from '@shared/env';
import { config } from 'dotenv';
import { bot } from 'telegram-standard-bot-api';
import { deleteWebhook } from 'telegram-standard-bot-api/methods';

async function main() {
  config({ path: '.env.local', quiet: true });

  bot.setApiKey(getEnvChecked('BOT_KEY'));
  await bot(deleteWebhook());
}

void main();
