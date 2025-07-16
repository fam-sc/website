import {
  array,
  infer as zodInfer,
  nullable,
  number,
  object,
  string,
} from 'zod/v4-mini';

export const step = object({
  id: number(),
  text: string(),
});

export type Step = zodInfer<typeof step>;

export const receptable = object({
  id: number(),
  announcement_text: nullable(string()),
  emoji_id: nullable(string()),
  reply_text: nullable(string()),
  text: nullable(string()),
});

export type Receptacle = zodInfer<typeof receptable>;

export const answerOption = object({
  id: number(),
  text: string(),
  next_step_id: nullable(number()),
  receptacle_id: nullable(number()),
  step_id: number(),
});

export type AnswerOption = zodInfer<typeof answerOption>;

export const botFlowConfig = object({
  options: array(answerOption),
  receptacles: array(receptable),
  steps: array(step),
});

export type BotFlowConfig = zodInfer<typeof botFlowConfig>;
