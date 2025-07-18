import { array, nullable, number, object, string } from 'zod/v4-mini';

export const step = object({
  id: number(),
  text: string(),
});

export const receptacle = object({
  id: number(),
  announcement_text: nullable(string()),
  emoji_id: nullable(string()),
  reply_text: nullable(string()),
  text: nullable(string()),
});

export const answerOption = object({
  id: number(),
  text: string(),
  next_step_id: nullable(number()),
  receptacle_id: nullable(number()),
  step_id: number(),
});

export const botFlowConfig = object({
  options: array(answerOption),
  receptacles: array(receptacle),
  steps: array(step),
});
