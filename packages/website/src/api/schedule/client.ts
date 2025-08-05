import { UpdateScheduleLinksPayload } from '@/api/schedule/payloads';
import { Schedule } from '@/api/schedule/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';
import { ExportScheduleOptions } from './export/options/types';
import { ExportSchedulePayload } from './export/types';

export function getSchedule(groupId: string): Promise<Schedule> {
  return apiFetchObject(`/schedule?group=${groupId}`);
}

export async function updateScheduleLinks(
  groupId: string,
  payload: UpdateScheduleLinksPayload
) {
  await apiCheckedFetch(`/schedule?group=${groupId}&type=link`, {
    method: 'PATCH',
    body: payload,
    json: true,
  });
}

export function getExportScheduleOptions(
  groupId: string
): Promise<ExportScheduleOptions> {
  return apiFetchObject(`/schedule/export/options?groupId=${groupId}`);
}

export function exportSchedule(
  groupId: string,
  payload: ExportSchedulePayload
) {
  return apiCheckedFetch(`/schedule/export?groupId=${groupId}`, {
    method: 'POST',
    body: payload,
    json: true,
  });
}
