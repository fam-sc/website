import { checkedFetch } from '@shared/fetch';
import { AddPollPayload, SubmitPollPayload } from './types';

export function addPoll(payload: AddPollPayload) {
  return checkedFetch(`/api/polls`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function submitPoll(id: string, payload: SubmitPollPayload) {
  return checkedFetch(`/api/polls/${id}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
