import { createTelegramBot } from 'telegram-standard-bot-api';
import { getForumTopicIconStickers } from 'telegram-standard-bot-api/methods';

import {
  BotFlowInMeta,
  BotFlowWithInMeta,
  BotFlowWithOutMeta,
  PositionMap,
} from '@/api/botFlow/types';

import { MediaFilePath } from '../media/types';
import {
  getInternalBotFlowConfig,
  putInternalBotFlowConfig,
} from './internal/client';
import { BotFlowConfig } from './internal/types';
import { downloadStickers, listMediaStickers } from './stickers';

const NODE_POSITIONS_PATH: MediaFilePath = 'bot-flow/node-positions.json';

async function getNodePositions(bucket: R2Bucket): Promise<PositionMap> {
  const object = await bucket.get(NODE_POSITIONS_PATH);
  const data = await object?.json<PositionMap>();

  return data ?? { option: {}, receptacle: {}, step: {} };
}

async function putNodePositions(bucket: R2Bucket, positions: PositionMap) {
  await bucket.put(NODE_POSITIONS_PATH, JSON.stringify(positions));
}

export async function getBotFlow(env: Env): Promise<BotFlowWithOutMeta> {
  const bucket = env.MEDIA_BUCKET;
  const botKey = env.TG_BOT_KEY;
  const bot = createTelegramBot({ apiKey: botKey });

  const [stickers, mediaStickers] = await Promise.all([
    bot(getForumTopicIconStickers()),
    listMediaStickers(bucket),
  ]);

  const [config, positions, icons] = await Promise.all([
    getInternalBotFlowConfig(env.HELPDESK_API_KEY),
    getNodePositions(bucket),
    downloadStickers(bot, botKey, bucket, stickers, mediaStickers),
  ]);

  const { steps, receptacles, options } = config;

  return {
    steps: steps.map((step) => ({
      id: step.id,
      text: step.text,
      options: options
        .filter((option) => option.step_id === step.id)
        .map((option) => {
          return {
            id: option.id,
            text: option.text,
            nextStepId: option.next_step_id,
            receptacleId: option.receptacle_id,
          };
        }),
    })),
    receptacles: receptacles.map((value) => ({
      id: value.id,
      emojiId: value.emoji_id,
    })),
    meta: { icons, positions },
  };
}

export async function saveBotFlow(env: Env, inBotFlow: BotFlowWithInMeta) {
  const options: BotFlowConfig['options'] = inBotFlow.steps.flatMap((step) =>
    step.options.map((option) => {
      return {
        id: option.id,
        text: option.text,
        step_id: step.id,
        next_step_id: option.nextStepId,
        receptacle_id: option.receptacleId,
      };
    })
  );

  const receptacles: BotFlowConfig['receptacles'] = inBotFlow.receptacles.map(
    (receptacle) => ({
      id: receptacle.id,
      text: null,
      announcement_text: null,
      reply_text: null,
      emoji_id: receptacle.emojiId,
    })
  );

  const steps: BotFlowConfig['steps'] = inBotFlow.steps.map(({ id, text }) => ({
    id,
    text,
  }));

  const newConfig = { steps, options, receptacles };

  await Promise.all([
    putInternalBotFlowConfig(env.HELPDESK_API_KEY, newConfig),
    saveBotFlowMeta(env, inBotFlow.meta),
  ]);
}

export async function saveBotFlowMeta(env: Env, meta: BotFlowInMeta) {
  await putNodePositions(env.MEDIA_BUCKET, meta.positions);
}
