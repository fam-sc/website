import { checkedFetch } from '@sc-fam/shared';
import { TelegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/types.js';

export function authorizeScheduleBot(
  payload: TelegramBotAuthPayload,
  accessKey: string
) {
  return checkedFetch(`https://schedule-bot.sc-fam.org/auth`, {
    method: 'POST',
    body: payload,
    json: true,
    headers: {
      Authorization: `Bearer ${accessKey}`,
    },
  });
}
