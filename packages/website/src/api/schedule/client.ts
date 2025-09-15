import { UpdateScheduleLinksPayload } from '@/api/schedule/payloads';
import { Schedule } from '@/api/schedule/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';
import { ExportScheduleOptions } from './export/options/types';
import { ExportSchedulePayload } from './export/types';

export function getSchedule(groupName: string): Promise<Schedule> {
  return apiFetchObject(`/schedule?group=${groupName}`);
}

export async function updateScheduleLinks(
  groupName: string,
  payload: UpdateScheduleLinksPayload
) {
  await apiCheckedFetch(`/schedule?group=${groupName}&type=link`, {
    method: 'PATCH',
    body: payload,
    json: true,
  });
}

export function getExportScheduleOptions(
  groupName: string,
  access: string
): Promise<ExportScheduleOptions> {
  return apiFetchObject(`/schedule/export/options?group=${groupName}`, {
    headers: {
      'X-Access-Token': access,
    },
  });
}

export function exportSchedule(
  groupName: string,
  payload: ExportSchedulePayload,
  access: string
) {
  return apiCheckedFetch(`/schedule/export?group=${groupName}`, {
    method: 'POST',
    headers: {
      'X-Access-Token': access,
    },
    body: payload,
    json: true,
  });
}
