import { getLessons } from '@shared/api/campus';

import {
  campusScheduleToDataSchedule,
  dataScheduleToApiSchedule,
  getUniqueTeachers,
} from './transform';
import { Schedule as ApiSchedule } from '@/api/schedule/types';

import { CachedExternalApi } from '@data/cache';
import { Repository } from '@data/repo';
import { ScheduleWithTeachers as DataScheduleWithTeachers } from '@data/types/schedule';
import { getTeachers } from './teachers';

// 7 days
const SCHEDULE_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

class ScheduleExternalApi extends CachedExternalApi<DataScheduleWithTeachers> {
  private groupId: string;

  constructor(groupId: string, repo?: Repository) {
    super('schedule', SCHEDULE_INVALIDATE_TIME, repo);

    this.groupId = groupId;
  }

  protected fetchFromRepo(repo: Repository) {
    return repo.schedule().findByGroupWithTeachers(this.groupId);
  }

  protected async fetchFromExternalApi(): Promise<DataScheduleWithTeachers> {
    const campusSchedule = await getLessons(this.groupId);
    const teachers = await getTeachers(getUniqueTeachers(campusSchedule));

    return campusScheduleToDataSchedule(campusSchedule, teachers);
  }

  protected putToRepo(repo: Repository, value: DataScheduleWithTeachers) {
    return [
      ...repo.schedule().upsertWeeks(value),
      ...repo.scheduleTeachers().insertFromSchedule(value),
    ];
  }
}

const getDataSchedule = CachedExternalApi.accessor(ScheduleExternalApi);

export async function getScheduleForGroup(
  groupId: string
): Promise<ApiSchedule> {
  const repo = Repository.openConnection();
  const dataSchedule = await getDataSchedule(groupId, repo);
  let { links } = dataSchedule;

  if (links === undefined) {
    links = await repo.schedule().getLinks(groupId);
  }

  return dataScheduleToApiSchedule(dataSchedule, links ?? {});
}
