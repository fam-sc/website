import { getEnvChecked } from '@sc-fam/shared/env.js';
import { config } from 'dotenv';
import { bot } from 'telegram-standard-bot-api';
import { setMyCommands } from 'telegram-standard-bot-api/methods';

async function main() {
  config({ path: '.env.local', quiet: true });

  bot.setApiKey(getEnvChecked('BOT_KEY'));
  await bot(
    setMyCommands({
      commands: [
        { command: '/switch', description: '🔘 Вкл/Викл' },
        { command: '/myday', description: '🗓 Розклад на день' },
      ],
    })
  );
}

void main();
