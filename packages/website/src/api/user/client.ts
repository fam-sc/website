import { checkedFetch } from '@shared/fetch';

export function uploadUserAvatar(body: BodyInit) {
  return checkedFetch(`/api/user/avatar`, {
    method: 'POST',
    body,
  });
}
