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
  groupId: string,
  access: string
): Promise<ExportScheduleOptions> {
  return apiFetchObject(`/schedule/export/options?groupId=${groupId}`, {
    headers: {
      'X-Access-Token': access,
    },
  });
}

export function exportSchedule(
  groupId: string,
  payload: ExportSchedulePayload,
  access: string
) {
  return apiCheckedFetch(`/schedule/export?groupId=${groupId}`, {
    method: 'POST',
    headers: {
      'X-Access-Token': access,
    },
    body: payload,
    json: true,
  });
}
