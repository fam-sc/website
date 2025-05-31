import { Schedule } from './types';

import { UpdateScheduleLinksPayload } from './types';
import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function getSchedule(groupId: string): Promise<Schedule> {
  return apiFetchObject(`/api/schedule?group=${groupId}`);
}

export async function updateScheduleLinks(
  groupId: string,
  payload: UpdateScheduleLinksPayload
) {
  await apiCheckedFetch(`/api/schedule?group=${groupId}&type=link`, {
    method: 'PATCH',
    body: payload,
    json: true,
  });
}
