import { Group, Repository } from '@sc-fam/data';
import { getGroups } from '@sc-fam/shared/api/campus/index.js';

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

  await repo.batch([
    repo.groups().deleteWhere({}),
    ...repo.groups().insertOrUpdateAll(groups),
  ]);
}
