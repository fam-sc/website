import { Repository, ScheduleWithTeachers } from '@sc-fam/data';
import { getLessons } from '@sc-fam/shared/api/campus/index.js';

import { getTeachers } from './teachers';
import {
  campusScheduleToDataSchedule,
  dataScheduleToApiSchedule,
  getUniqueTeachers,
} from './transform';
import { Schedule as ApiSchedule } from './types';

// 7 days
const SCHEDULE_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

async function getDataSchedule(
  groupId: string
): Promise<ScheduleWithTeachers | null> {
  const repo = Repository.openConnection();
  const schedule = await repo.schedule().getSchedule(groupId).get();
  const now = Date.now();

  if (
    schedule !== null &&
    now - schedule.lastUpdateTime > SCHEDULE_INVALIDATE_TIME
  ) {
    const campusSchedule = await getLessons(groupId);
    const teachers = await getTeachers(getUniqueTeachers(campusSchedule));
    const newSchedule = campusScheduleToDataSchedule(campusSchedule, teachers);

    const [links] = await repo.batch([
      repo.schedule().getLinks(groupId),
      repo.schedule().updateLastUpdateTime(groupId, now),
      ...repo.schedule().upsertWeeks(newSchedule),
      ...repo.scheduleTeachers().insertFromSchedule(newSchedule),
    ]);

    return { ...newSchedule, links };
  }

  return schedule;
}

export async function getScheduleForGroup(
  groupId: string
): Promise<ApiSchedule | null> {
  const dataSchedule = await getDataSchedule(groupId);
  if (dataSchedule === null) {
    return null;
  }

  return dataScheduleToApiSchedule(dataSchedule);
}
