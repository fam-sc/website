import { CachedExternalApi } from '@data/cache';
import { Repository } from '@data/repo';
import { Group } from '@data/types';

// 7 days
const GROUP_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

abstract class BaseExternalApi<T> extends CachedExternalApi<T, Group[]> {
  constructor() {
    super('groups', GROUP_INVALIDATE_TIME);
  }

  protected fetchFromExternalApi(): Promise<Group[]> {
    return getFacultyGroups();
  }

  protected async putToRepo(repo: Repository, value: Group[]): Promise<void> {
    await repo.groups().insertOrUpdateAll(value);
  }
}

class GetFacultyGroupByIdExternalApi extends BaseExternalApi<Group | null> {
  private groupId: string;

  constructor(groupId: string) {
    super();
    this.groupId = groupId;
  }

  protected fetchFromRepo(repo: Repository): Promise<Group | null> {
    return repo.groups().findByCampusId(this.groupId);
  }

  protected mapFetchResult(value: Group[]): Group | null {
    return value.find((group) => group.campusId === this.groupId) ?? null;
  }
}

class GetFacultyGroupListByIdExternalApi extends BaseExternalApi<Group[]> {
  private groupIds: Set<string>;

  constructor(groupIds: Set<string>) {
    super();

    this.groupIds = groupIds;
  }

  protected fetchFromRepo(repo: Repository): Promise<Group[]> {
    return repo.groups().findByIds([...this.groupIds]);
  }

  protected mapFetchResult(value: Group[]): Group[] {
    return value.filter((group) => this.groupIds.has(group.campusId));
  }
}

class GetFacultyGroupsExternalApi extends BaseExternalApi<Group[]> {
  protected fetchFromRepo(repo: Repository): Promise<Group[]> {
    return repo.groups().getAll().toArray() as Promise<Group[]>;
  }
}

class GroupExistsExternalApi extends BaseExternalApi<boolean> {
  private groupId: string;

  constructor(groupId: string) {
    super();
    this.groupId = groupId;
  }

  protected fetchFromRepo(repo: Repository): Promise<boolean> {
    return repo.groups().groupExists(this.groupId);
  }

  protected mapFetchResult(value: Group[]): boolean {
    return value.some((group) => group.campusId === this.groupId);
  }
}

export const getFacultyGroupById = CachedExternalApi.accessor(
  GetFacultyGroupByIdExternalApi
);

export const getFacultyGroupListById = CachedExternalApi.accessor(
  GetFacultyGroupListByIdExternalApi
);

export const getFacultyGroups = CachedExternalApi.accessor(
  GetFacultyGroupsExternalApi
);

export const checkFacultyGroupExists = CachedExternalApi.accessor(
  GroupExistsExternalApi
);
