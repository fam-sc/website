import { getLessons } from '../campus';

import {
  campusScheduleToDataSchedule,
  dataScheduleToApiSchedule,
} from './transform';
import { Schedule as ApiSchedule } from './types';

import { CachedExternalApi } from '@/data/cache';
import { Repository } from '@/data/repo';
import { Schedule as DataSchedule } from '@/data/types/schedule';

// 7 days
const SCHEDULE_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

class ScheduleExternalApi extends CachedExternalApi<DataSchedule> {
  private groupId: string;

  constructor(groupId: string, repo?: Repository) {
    super('schedule', SCHEDULE_INVALIDATE_TIME, repo);

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

const getDataSchedule = CachedExternalApi.accessor(ScheduleExternalApi);

export async function getScheduleForGroup(
  groupId: string
): Promise<ApiSchedule> {
  await using repo = await Repository.openConnection();
  const dataSchedule = await getDataSchedule(groupId, repo);

  return await dataScheduleToApiSchedule(dataSchedule, repo);
}
