import type {
  AddPollPayload,
  PollResultsTable,
  SubmitPollPayload,
} from '@shared/api/polls/types';
import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function addPoll(payload: AddPollPayload) {
  return apiCheckedFetch(`/polls`, {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function submitPoll(id: string, payload: SubmitPollPayload) {
  return apiCheckedFetch(`/polls/${id}`, {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function closePoll(id: string) {
  return apiCheckedFetch(`/polls/${id}/close`, {
    method: 'POST',
  });
}

export function fetchPollResultsTable(id: string) {
  return apiFetchObject<PollResultsTable>(`/polls/${id}/table`);
}
