import {
  array,
  infer as zodInfer,
  nullable,
  number,
  object,
  optional,
  record,
  string,
} from 'zod/v4-mini';

export interface BotFlowWithOutMeta extends BotFlow {
  meta: BotFlowOutMeta;
}

const position = object({
  x: number(),
  y: number(),
});

export type Position = zodInfer<typeof position>;

const positionTypeMap = record(number(), optional(position));

const positionMap = object({
  step: positionTypeMap,
  receptacle: positionTypeMap,
  option: positionTypeMap,
});

export type PositionMap = zodInfer<typeof positionMap>;

export type BotFlowOutMeta = {
  icons: Sticker[];
  positions: PositionMap | undefined;
};

export type Sticker = {
  id: string;
  source: string;
  width: number;
  height: number;
};

export const option = object({
  id: number(),
  text: string(),
  nextStepId: nullable(number()),
  receptacleId: nullable(number()),
});

export type Option = zodInfer<typeof option>;

export const receptacle = object({
  id: number(),
  emojiId: nullable(string()),
});

export type Receptacle = zodInfer<typeof receptacle>;

export const step = object({
  id: number(),
  text: string(),
  options: array(option),
});

export type Step = zodInfer<typeof step>;

export const botFlow = object({
  steps: array(step),
  receptacles: array(receptacle),
});

export type BotFlow = zodInfer<typeof botFlow>;

export const botFlowInMeta = object({
  positions: positionMap,
});

export type BotFlowInMeta = zodInfer<typeof botFlowInMeta>;

export const botFlowWithInMeta = object({
  ...botFlow.shape,
  meta: botFlowInMeta,
});

export type BotFlowWithInMeta = zodInfer<typeof botFlowWithInMeta>;
