'use server';

import { getFileDownloadUrl, getForumTopicIconStickers } from '../telegram';
import { Sticker } from '../telegram/types';

import { BotRepository } from '@/botData/repo';
import {
  BotFlowWithInMeta,
  BotFlowWithOutMeta,
  PositionMap,
} from '@/botFlow/types';
import { getImageSize } from '@/image/size';
import {
  fileExistsInCache,
  getFileLocalPath,
  saveRemoteFile,
} from '@/storage/file';
import { getObject, saveObject } from '@/storage/object';

const NODE_POSITIONS_KEY = 'node-positions';

function getStickerId(value: Sticker): string {
  return `tg-sticker-${value.file_unique_id}`;
}

function getExternalUrl(value: Sticker): string {
  return `/api/dynamic-asset?id=${getStickerId(value)}`;
}

export async function getBotFlow(): Promise<BotFlowWithOutMeta> {
  const stickers = await getForumTopicIconStickers();

  await Promise.all(
    stickers
      .filter((sticker) => !fileExistsInCache(getStickerId(sticker)))
      .map(async (sticker) => {
        const url = await getFileDownloadUrl(sticker.thumbnail.file_id);

        await saveRemoteFile(getStickerId(sticker), url);
      })
  );

  const icons = await Promise.all(
    stickers.map(async (value) => {
      const filePath = getFileLocalPath(getStickerId(value));
      const size = await getImageSize(filePath);

      return {
        id: value.custom_emoji_id as string,
        source: getExternalUrl(value),
        ...size,
      };
    })
  );

  const repo = BotRepository.createConnection();
  const [steps, options, receptables] = await Promise.all([
    repo.steps.getAll(),
    repo.options.getAll(),
    repo.receptacles.getAll(),
  ]);

  const positions = await getObject<PositionMap>(NODE_POSITIONS_KEY);

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
    receptables: receptables.map((value) => ({
      id: value.id,
      emojiId: value.emoji_id.toString(),
    })),
    meta: { icons, positions },
  };
}

function mapKeys<T>(
  map: Record<string, T>,
  keyMap: Record<string, string>
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const key in map) {
    result[keyMap[key]] = map[key];
  }

  return result;
}

export async function saveBotFlow(value: BotFlowWithInMeta): Promise<void> {
  const repo = BotRepository.createConnection();

  const stepIdMap = await repo.steps.upsert(
    value.steps.map((step) => ({
      id: step.id,
      templated: false,
      text: step.text,
    }))
  );
  const receptacleIdMap = await repo.receptacles.upsert(
    value.receptables.map((receptacle) => ({
      id: receptacle.id,
      emoji_id: receptacle.emojiId,
      announcement_text: '',
      chat_id: 0,
      reply_text: null,
      text: null,
    }))
  );

  const options = value.steps.flatMap((step) =>
    step.options.map((option) => {
      return {
        id: option.id,
        templated: false,
        text: option.text,
        step_id: stepIdMap[step.id],
        next_step_id:
          option.nextStepId === null ? null : stepIdMap[option.nextStepId],
        receptacle_id:
          option.receptacleId === null
            ? null
            : receptacleIdMap[option.receptacleId],
      };
    })
  );

  const optionIdMap = await repo.options.upsert(options);

  const { positions } = value.meta;

  await saveObject(NODE_POSITIONS_KEY, {
    step: mapKeys(positions.step, stepIdMap),
    receptacle: mapKeys(positions.receptacle, receptacleIdMap),
    option: mapKeys(positions.option, optionIdMap),
  });
}
