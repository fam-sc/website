import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from 'cloudflare:test';
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
  testCase('check positions', async () => {
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
