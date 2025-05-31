import { Group } from '@data/types';
import { apiFetchObject } from '../fetch';

export function getGroups(): Promise<Group[]> {
  return apiFetchObject('/api/groups');
}
