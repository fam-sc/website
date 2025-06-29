import { Group } from '@/api/groups/types';

import { apiFetch, apiFetchObject, getApiErrorFromResponse } from '../fetch';

export function getGroups(): Promise<Group[]> {
  return apiFetchObject('/groups');
}

export async function getGroupById(id: string): Promise<Group | null> {
  const response = await apiFetch(`/groups/${id}`);
  if (response.status === 404) {
    return null;
  } else if (!response.ok) {
    throw await getApiErrorFromResponse(response);
  }

  return await response.json();
}
