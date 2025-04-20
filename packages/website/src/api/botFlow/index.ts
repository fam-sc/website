'use server';

import {
  fetchMediaObject,
  getMediaFileUrl,
  listMediaFiles,
  putMediaFileViaUrl,
  putMediaObject,
} from '../media';
import { getFileDownloadUrlById, getForumTopicIconStickers } from '../telegram';
import { Sticker } from '../telegram/types';

import { BotRepository } from '@/botData/repo';
import {
  BotFlowWithInMeta,
  BotFlowWithOutMeta,
  PositionMap,
} from '@/botFlow/types';

const NODE_POSITIONS_PATH = 'bot-flow/node-positions.json';
const STICKER_PREFIX = 'bot-flow/tg-sticker';

function getStickerPath(value: Sticker): string {
  return `${STICKER_PREFIX}/${value.file_unique_id}`;
}

function getExternalUrl(value: Sticker): string {
  return getMediaFileUrl(getStickerPath(value));
}

export async function getBotFlow(): Promise<BotFlowWithOutMeta> {
  const [stickers, mediaStickers] = await Promise.all([
    getForumTopicIconStickers(),
    listMediaFiles(STICKER_PREFIX),
  ]);

  await Promise.all(
    stickers
      .filter((sticker) => !mediaStickers.includes(getStickerPath(sticker)))
      .map(async (sticker) => {
        const url = await getFileDownloadUrlById(sticker.thumbnail.file_id);

        await putMediaFileViaUrl(getStickerPath(sticker), url);
      })
  );

  const icons = stickers.map((value) => {
    return {
      id: value.custom_emoji_id as string,
      source: getExternalUrl(value),
      width: 512,
      height: 512,
    };
  });

  const repo = BotRepository.createConnection();
  const [steps, options, receptables] = await Promise.all([
    repo.steps.getAll(),
    repo.options.getAll(),
    repo.receptacles.getAll(),
  ]);

  const positions = await fetchMediaObject<PositionMap>(NODE_POSITIONS_PATH);

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

export async function saveBotFlow({
  steps,
  receptables,
  meta,
}: BotFlowWithInMeta): Promise<BotFlowWithInMeta> {
  const repo = BotRepository.createConnection();

  const stepIdMap = await repo.steps.upsert(
    steps.map((step) => ({
      id: step.id,
      templated: false,
      text: step.text,
    }))
  );

  const receptacleIdMap = await repo.receptacles.upsert(
    receptables.map((receptacle) => ({
      id: receptacle.id,
      emoji_id: receptacle.emojiId,
      announcement_text: '',
      chat_id: 0,
      reply_text: null,
      text: null,
    }))
  );

  const options = steps.flatMap((step) =>
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

  const { positions } = meta;
  const newPositions: PositionMap = {
    step: mapKeys(positions.step, stepIdMap),
    receptacle: mapKeys(positions.receptacle, receptacleIdMap),
    option: mapKeys(positions.option, optionIdMap),
  };

  await putMediaObject(NODE_POSITIONS_PATH, newPositions);

  return {
    steps: steps.map((step) => ({
      id: stepIdMap[step.id],
      text: step.text,
      options: step.options.map(({ id, ...rest }) => ({
        id: optionIdMap[id],
        ...rest,
      })),
    })),
    receptables: receptables.map(({ id, ...rest }) => ({
      id: receptacleIdMap[id],
      ...rest,
    })),
    meta: { positions: newPositions },
  };
}
