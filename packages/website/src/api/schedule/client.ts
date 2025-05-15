import { Schedule } from './types';

import { Group } from '@data/types';
import { checkedFetch, fetchObject } from '@shared/fetch';
import { UpdateScheduleLinksPayload } from './types';

export function getGroups(): Promise<Group[]> {
  return fetchObject('/api/schedule/groups');
}

export function getSchedule(groupId: string): Promise<Schedule> {
  return fetchObject(`/api/schedule?group=${groupId}`);
}

export async function updateScheduleLinks(
  groupId: string,
  payload: UpdateScheduleLinksPayload
) {
  await checkedFetch(`/api/schedule?group=${groupId}&type=link`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
