import type {
  AddPollPayload,
  PollResultsTable,
  SubmitPollPayload,
} from '@/api/polls/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function addPoll(payload: AddPollPayload) {
  return apiCheckedFetch(`/polls`, {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function submitPoll(id: number, payload: SubmitPollPayload) {
  return apiCheckedFetch(`/polls/${id}`, {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function closePoll(id: number) {
  return apiCheckedFetch(`/polls/${id}/close`, {
    method: 'POST',
  });
}

export function fetchPollResultsTable(id: number) {
  return apiFetchObject<PollResultsTable>(`/polls/${id}/table`);
}
