import { Group } from '@/api/groups/types';

import { apiFetchObject } from '../fetch';

export function getGroups(): Promise<Group[]> {
  return apiFetchObject('/groups');
}
