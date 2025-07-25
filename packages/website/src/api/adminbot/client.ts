import { checkedFetch } from '@sc-fam/shared';
import {
  NewUserApprovedExternallyEventPayload,
  NewUserEventPayload,
} from '@sc-fam/shared/api/adminbot/types.js';
import { TelegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/types.js';

function authRequest(path: string, payload: object, accessKey: string) {
  return checkedFetch(`https://admin-bot.sc-fam.org${path}`, {
    method: 'POST',
    body: payload,
    json: true,
    headers: {
      Authorization: `Bearer ${accessKey}`,
    },
  });
}

export function authorizeAdminBot(
  payload: TelegramBotAuthPayload,
  accessKey: string
) {
  return authRequest('/auth', payload, accessKey);
}

export function notifyNewUserCreated(
  payload: NewUserEventPayload,
  accessKey: string
) {
  return authRequest('/events/user', payload, accessKey);
}

export function notifyUserApprovedExternally(
  payload: NewUserApprovedExternallyEventPayload,
  accessKey: string
) {
  return authRequest('/events/user/approvedExternally', payload, accessKey);
}
