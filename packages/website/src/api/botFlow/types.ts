import { ImageFormat } from '@sc-fam/shared/image/mime.js';
import { infer as zodInfer } from 'zod/v4-mini';

import type {
  botFlow,
  botFlowInMeta,
  botFlowWithInMeta,
  option,
  position,
  positionMap,
  receptacle,
  step,
} from './schema';

export interface BotFlowWithOutMeta extends BotFlow {
  meta: BotFlowOutMeta;
}

export type Position = zodInfer<typeof position>;

export type PositionMap = zodInfer<typeof positionMap>;

export type StickerSource = `bot-flow/tg-sticker/${string}.${ImageFormat}`;
export type StickerInfo = { id: string; source: StickerSource };

export type BotFlowOutMeta = {
  stickers: StickerInfo[];
  positions: PositionMap | undefined;
};

export type Option = zodInfer<typeof option>;
export type Receptacle = zodInfer<typeof receptacle>;
export type Step = zodInfer<typeof step>;
export type BotFlow = zodInfer<typeof botFlow>;
export type BotFlowInMeta = zodInfer<typeof botFlowInMeta>;
export type BotFlowWithInMeta = zodInfer<typeof botFlowWithInMeta>;
