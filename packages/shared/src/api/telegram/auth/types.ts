import { infer as zodInfer } from 'zod/v4-mini';

import type { telegramBotAuthPayload } from './schema.js';

export type TelegramBotAuthPayload = zodInfer<typeof telegramBotAuthPayload>;
