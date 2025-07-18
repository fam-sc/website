import { UpdateScheduleLinksPayload } from '@/api/schedule/payloads';
import { Schedule } from '@/api/schedule/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';

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
