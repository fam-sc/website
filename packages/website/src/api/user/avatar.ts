import { mediaFileExists } from '../media';

export function checkUserHasAvatar(id: string): Promise<boolean> {
  return mediaFileExists(`user/${id}`);
}

export function checkUsersHaveAvatar(
  users: { id: string }[]
): Promise<boolean[]> {
  return Promise.all(users.map(({ id }) => checkUserHasAvatar(id)));
}
