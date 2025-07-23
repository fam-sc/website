import { Repository } from '@data/repo';
import { Group } from '@data/types';
import { getGroups } from '@shared/api/campus';

const FACULTY = 'ФПМ';

async function getApiFacultyGroups(): Promise<Group[]> {
  const allGroups = await getGroups();

  return allGroups
    .filter((value) => value.faculty === FACULTY)
    .map(({ id, name }) => ({ campusId: id, name }));
}

export async function syncGroups() {
  const repo = Repository.openConnection();
  const groups = await getApiFacultyGroups();

  await repo.batch(repo.groups().insertOrUpdateAll(groups));
}
