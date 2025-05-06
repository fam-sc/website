import { getGroups } from '../campus';

import { CachedExternalApi } from '@/data/cache';
import { Repository } from '@/data/repo';
import { Group } from '@/data/types';

// 7 days
const GROUP_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

const FACULTY = 'ФПМ';

async function getApiFacultyGroups(): Promise<Group[]> {
  const allGroups = await getGroups();

  return allGroups
    .filter((value) => value.faculty === FACULTY)
    .map(({ id, name }) => ({ campusId: id, name }));
}

class FacultyGroupGetterExternalApi extends CachedExternalApi<
  Group | null,
  Group[]
> {
  private groupId: string;

  constructor(groupId: string) {
    super('groups', GROUP_INVALIDATE_TIME);

    this.groupId = groupId;
  }

  protected fetchFromRepo(repo: Repository): Promise<Group | null> {
    return repo.groups().findByCampusId(this.groupId);
  }

  protected fetchFromExternalApi(): Promise<Group[]> {
    return getApiFacultyGroups();
  }

  protected async putToRepo(repo: Repository, value: Group[]): Promise<void> {
    await repo.groups().insertOrUpdateAll(value);
  }

  protected mapFetchResult(value: Group[]): Group | null {
    return value.find((group) => group.campusId === this.groupId) ?? null;
  }
}

class FacultyGroupsExternalApi extends CachedExternalApi<Group[]> {
  constructor() {
    super('groups', GROUP_INVALIDATE_TIME);
  }

  protected fetchFromRepo(repo: Repository): Promise<Group[]> {
    return repo.groups().getAll().toArray() as Promise<Group[]>;
  }

  protected fetchFromExternalApi(): Promise<Group[]> {
    return getApiFacultyGroups();
  }

  protected async putToRepo(repo: Repository, value: Group[]): Promise<void> {
    await repo.groups().insertOrUpdateAll(value);
  }
}

export const getFacultyGroupById = CachedExternalApi.accessor(
  FacultyGroupGetterExternalApi
);

export const getFacultyGroups = CachedExternalApi.accessor(
  FacultyGroupsExternalApi
);
