import { getGroups, getLessons } from '../campus';

import {
  campusScheduleToDataSchedule,
  dataScheduleToApiSchedule,
} from './transform';
import { Schedule as ApiSchedule } from './types';

import { CachedExternalApi } from '@/data/cache';
import { Repository } from '@/data/repo';
import { Group } from '@/data/types';
import { Schedule as DataSchedule } from '@/data/types/schedule';

// 7 days
const GROUP_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

// 7 days
const SCHEDULE_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

const FACULTY = 'ФПМ';

async function getApiFacultyGroups(): Promise<Group[]> {
  const allGroups = await getGroups();

  return allGroups
    .filter((value) => value.faculty === FACULTY)
    .map(({ id, name }) => ({ campusId: id, name }));
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

class ScheduleExternalApi extends CachedExternalApi<DataSchedule> {
  private groupId: string;

  constructor(groupId: string) {
    super('schedule', SCHEDULE_INVALIDATE_TIME);

    this.groupId = groupId;
  }

  protected fetchFromRepo(repo: Repository) {
    return repo.schedule().findByGroup(this.groupId);
  }

  protected async fetchFromExternalApi(): Promise<DataSchedule> {
    const campusSchedule = await getLessons(this.groupId);

    return campusScheduleToDataSchedule(campusSchedule);
  }

  protected async putToRepo(repo: Repository, value: DataSchedule) {
    await repo.schedule().upsert(value);
  }
}

export const getFacultyGroups = CachedExternalApi.accessor(
  FacultyGroupsExternalApi
);

const getDataSchedule = CachedExternalApi.accessor(ScheduleExternalApi);

export const getFacultyGroupById = CachedExternalApi.accessor(
  FacultyGroupGetterExternalApi
);

export async function getScheduleForGroup(
  groupId: string
): Promise<ApiSchedule> {
  const dataSchedule = await getDataSchedule(groupId);

  return await dataScheduleToApiSchedule(dataSchedule);
}
