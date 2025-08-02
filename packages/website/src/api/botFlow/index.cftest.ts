import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from 'cloudflare:test';
import { createTelegramBot } from 'telegram-standard-bot-api';
import { getForumTopicIconStickers } from 'telegram-standard-bot-api/methods';
import { describe, expect, test } from 'vitest';

import { getBotFlow, saveBotFlowMeta } from '.';
import { PositionMap } from './types';

function testCase(name: string, block: () => Promise<void>) {
  test(name, { timeout: 20_000 }, async () => {
    const ctx = createExecutionContext();
    await waitOnExecutionContext(ctx);

    await block();
  });
}

describe('getBotFlow', () => {
  testCase('check stickers and positions', async () => {
    const bot = createTelegramBot({ apiKey: env.TG_BOT_KEY });
    const expectedStickers = await bot(getForumTopicIconStickers());

    const positions: PositionMap = {
      option: { a: { x: 1, y: 2 } },
      step: { a: { x: 1, y: 2 } },
      receptacle: { a: { x: 1, y: 2 } },
    };

    await env.MEDIA_BUCKET.put(
      'bot-flow/node-positions.json',
      JSON.stringify(positions)
    );

    const botFlow = await getBotFlow(env);

    const actual = botFlow.meta.icons;

    expect(actual).toEqual(
      expectedStickers.map((value) => value.custom_emoji_id)
    );

    const prefix = 'bot-flow/tg-sticker';

    const { objects } = await env.MEDIA_BUCKET.list({
      prefix,
    });
    const objectKeys = new Set(objects.map(({ key }) => key));

    expect(objectKeys).toEqual(
      new Set(
        expectedStickers.map(
          ({ custom_emoji_id }) => `${prefix}/${custom_emoji_id}`
        )
      )
    );

    expect(botFlow.meta.positions).toEqual(positions);
  });
});

describe('saveBotFlowMeta', () => {
  testCase('check positions', async () => {
    const positions: PositionMap = {
      option: { a: { x: 1, y: 2 } },
      step: { a: { x: 3, y: 4 } },
      receptacle: { a: { x: 5, y: 6 } },
    };

    await saveBotFlowMeta(env, { positions });

    const object = await env.MEDIA_BUCKET.get('bot-flow/node-positions.json');
    const actual = await object?.json();

    expect(actual).toEqual(positions);
  });
});
