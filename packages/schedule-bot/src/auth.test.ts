import fs from 'node:fs';

import { config } from 'dotenv';
import { expect, test } from 'vitest';

import { verifyAuthorizationHash } from './auth';

const envFilePath = './packages/schedule-bot/.env.local';

if (fs.existsSync(envFilePath)) {
  config({ path: envFilePath, quiet: true });
}

const botKey = process.env.BOT_KEY;

test.runIf(botKey !== undefined)('verify', async () => {
  const result = await verifyAuthorizationHash(
    {
      authDate: 1_751_115_620,
      firstName: 'ok',
      telegramUserId: 856_704_033,
      username: 'pelmenstar',
      photoUrl:
        'https://t.me/i/userpic/320/89SFDmyotWQPTI551FNONVIDVVKPMUC7DVgRz5fNCB4.jpg',
      hash: '10536144710080625274a51acdd8b1204bdf9094dae6d812978cdbbee047276c',
    },
    botKey as string
  );

  expect(result).toBe(true);
});
