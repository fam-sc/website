import { checkedFetch } from '@shared/fetch';
import { AddPollPayload } from './payloads';

export function addPoll(payload: AddPollPayload) {
  return checkedFetch(`/api/polls`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
