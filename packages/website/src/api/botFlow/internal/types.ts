import { infer as zodInfer } from 'zod/v4-mini';

import type { answerOption, botFlowConfig, receptacle, step } from './schema';

export type Step = zodInfer<typeof step>;
export type Receptacle = zodInfer<typeof receptacle>;
export type AnswerOption = zodInfer<typeof answerOption>;
export type BotFlowConfig = zodInfer<typeof botFlowConfig>;
