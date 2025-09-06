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

export type StickerId = `bot-flow/tg-sticker/${string}.${ImageFormat}`;

export type BotFlowOutMeta = {
  icons: StickerId[];
  positions: PositionMap | undefined;
};

export type Option = zodInfer<typeof option>;
export type Receptacle = zodInfer<typeof receptacle>;
export type Step = zodInfer<typeof step>;
export type BotFlow = zodInfer<typeof botFlow>;
export type BotFlowInMeta = zodInfer<typeof botFlowInMeta>;
export type BotFlowWithInMeta = zodInfer<typeof botFlowWithInMeta>;
