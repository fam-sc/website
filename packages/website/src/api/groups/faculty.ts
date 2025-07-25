import { Group } from '@sc-fam/data';
import { getGroups } from '@sc-fam/shared/api/campus/index.js';

const FACULTY = 'ФПМ';

export async function getApiFacultyGroups(): Promise<Group[]> {
  const allGroups = await getGroups();

  return allGroups
    .filter((value) => value.faculty === FACULTY)
    .map(({ id, name }) => ({ campusId: id, name }));
}
