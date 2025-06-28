import { ScheduleBotAuthPayload } from '@shared/api/schedulebot/types';
import { checkedFetch } from '@shared/fetch';

export function authorizeScheduleBot(
  payload: ScheduleBotAuthPayload,
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
