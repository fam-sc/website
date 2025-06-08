import { getGroups } from '@shared/api/campus';
import { Group } from '@data/types';

const FACULTY = 'ФПМ';

export async function getApiFacultyGroups(): Promise<Group[]> {
  const allGroups = await getGroups();

  return allGroups
    .filter((value) => value.faculty === FACULTY)
    .map(({ id, name }) => ({ campusId: id, name }));
}
