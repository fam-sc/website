import { apiCheckedFetch, apiFetchObject } from '../fetch';
import {
  PollSpreadsheetInfo,
  SetPollSpreadsheetPayload,
} from './[id]/spreadsheet/types';
import type {
  AddPollPayload,
  PollResultsTable,
  SubmitPollPayload,
} from './types';

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

export function getPollSpreadsheetInfo(pollId: number) {
  return apiFetchObject<PollSpreadsheetInfo | null>(
    `/polls/${pollId}/spreadsheet`
  );
}

export function setPollSpreadsheet(
  pollId: number,
  payload: SetPollSpreadsheetPayload
) {
  return apiCheckedFetch(`/polls/${pollId}/spreadsheet`, {
    method: 'PUT',
    body: payload,
    json: true,
  });
}

export function exportPollToSpreadsheet(pollId: number) {
  return apiCheckedFetch(`/polls/${pollId}/spreadsheet/export`, {
    method: 'POST',
  });
}
