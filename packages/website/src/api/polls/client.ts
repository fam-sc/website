import { checkedFetch, fetchObject } from '@shared/fetch';
import { AddPollPayload, PollResultsTable, SubmitPollPayload } from './types';

export function addPoll(payload: AddPollPayload) {
  return checkedFetch(`/api/polls`, {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function submitPoll(id: string, payload: SubmitPollPayload) {
  return checkedFetch(`/api/polls/${id}`, {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function closePoll(id: string) {
  return checkedFetch(`/api/polls/${id}/close`, {
    method: 'POST',
  });
}

export function fetchPollResultsTable(id: string) {
  return fetchObject<PollResultsTable>(`/api/polls/${id}/table`);
}
