import { TelegramBotAuthPayload } from '@shared/api/telegram/auth/types';
import { checkedFetch } from '@shared/fetch';

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
