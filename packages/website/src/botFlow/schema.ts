import {
  array,
  extend,
  nullable,
  number,
  object,
  optional,
  record,
  string,
} from 'zod/v4-mini';

export const position = object({
  x: number(),
  y: number(),
});

export const positionTypeMap = record(string(), optional(position));

export const positionMap = object({
  step: positionTypeMap,
  receptacle: positionTypeMap,
  option: positionTypeMap,
});

export const option = object({
  id: number(),
  text: string(),
  nextStepId: nullable(number()),
  receptacleId: nullable(number()),
});

export const receptacle = object({
  id: number(),
  emojiId: nullable(string()),
});

export const step = object({
  id: number(),
  text: string(),
  options: array(option),
});

export const botFlowInMeta = object({
  positions: positionMap,
});

export const botFlow = object({
  steps: array(step),
  receptacles: array(receptacle),
});

export const botFlowWithInMeta = extend(botFlow, {
  meta: botFlowInMeta,
});
