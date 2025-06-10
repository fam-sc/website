import { Group } from '@shared/api/groups/types';
import { apiFetchObject, getApiErrorFromResponse } from '../fetch';

export function getGroups(): Promise<Group[]> {
  return apiFetchObject('/api/groups');
}

export async function getGroupById(id: string): Promise<Group | null> {
  const response = await fetch(`/api/groups/${id}`);
  if (response.status === 404) {
    return null;
  } else if (!response.ok) {
    throw await getApiErrorFromResponse(response);
  }

  return await response.json();
}
