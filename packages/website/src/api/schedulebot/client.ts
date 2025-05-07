import { checkedFetch } from '@/utils/fetch';

type Payload = {
  userId: string;
  telegramUserId: string;
  username: string;
  firstName: string;
  authDate: string;
  hash: string;
};

export function finishAuthToScheduleBot(payload: Payload) {
  const url = new URL('https://schedule-bot.sc-fam.org/auth');
  url.searchParams.set('uid', payload.userId);
  url.searchParams.set('tid', payload.telegramUserId);
  url.searchParams.set('username', payload.username);
  url.searchParams.set('first_name', payload.firstName);
  url.searchParams.set('auth_date', payload.authDate);
  url.searchParams.set('hash', payload.hash);

  return checkedFetch(url, {
    method: 'POST',
  });
}
