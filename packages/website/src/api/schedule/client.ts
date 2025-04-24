import { Schedule } from './types';

import { Group } from '@/data/types';
import { fetchObject } from '@/utils/fetch';

export function getGroups(): Promise<Group[]> {
  return fetchObject('/api/schedule/groups');
}

export function getSchedule(groupId: string): Promise<Schedule> {
  return fetchObject(`/api/schedule?group=${groupId}`);
}
