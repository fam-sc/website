import { getGroups, getLessons } from '../campus';

import {
  campusScheduleToDataSchedule,
  dataScheduleToApiSchedule,
} from './transform';
import { Schedule as ApiSchedule } from './types';

import { Repository } from '@/data/repo';
import { Group } from '@/data/types';
import { Schedule as DataSchedule } from '@/data/types/schedule';

// 7 days
const GROUP_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

// 7 days
const SCHEDULE_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

const FACULTY = 'ФПМ';

async function getFacultyGroupsFromCampusApi(): Promise<Group[]> {
  const allGroups = await getGroups();

  return allGroups
    .filter((value) => value.faculty === FACULTY)
    .map(({ id, name }) => ({ campusId: id, name }));
}

export async function getFacultyGroups(): Promise<Group[]> {
  await using repo = await Repository.openConnection();

  const lastUpdateTime = await repo.updateTime().getByType('groups');
  const now = Date.now();

  if (now - lastUpdateTime < GROUP_INVALIDATE_TIME) {
    const result = (await repo.groups().getAll().toArray()) as Group[];

    if (result.length > 0) {
      return result;
    }
  }

  const groups = await getFacultyGroupsFromCampusApi();

  await repo.groups().insertOrUpdateAll(groups);
  await repo.updateTime().setByType('groups', now);

  return groups;
}

async function getDataSchedule(
  repo: Repository,
  groupId: string
): Promise<DataSchedule> {
  const lastUpdateTime = await repo.updateTime().getByType('schedule');
  const now = Date.now();

  if (now - lastUpdateTime < SCHEDULE_INVALIDATE_TIME) {
    const result = await repo.schedule().findByGroup(groupId);
    if (result !== null) {
      return result;
    }
  }

  const campusSchedule = await getLessons(groupId);
  const dataSchedule = campusScheduleToDataSchedule(campusSchedule);

  await repo.schedule().upsert(dataSchedule);

  return dataSchedule;
}

export async function getScheduleForGroup(
  groupId: string
): Promise<ApiSchedule> {
  await using repo = await Repository.openConnection();

  const dataSchedule = await getDataSchedule(repo, groupId);

  return await dataScheduleToApiSchedule(dataSchedule, repo);
}
