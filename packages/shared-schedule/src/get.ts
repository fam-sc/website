import {
  Repository,
  ScheduleWithTeachersAndDisciplineLink,
} from '@sc-fam/data';
import { getLessons } from '@sc-fam/shared/api/campus/index.js';

import { getTeachers } from './teachers';
import {
  campusScheduleToDataSchedule,
  dataScheduleToApiSchedule,
} from './transform';
import { Schedule as ApiSchedule } from './types';
import { getUniqueLessonNames, getUniqueTeachers } from './utils';

// 7 days
const SCHEDULE_INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

async function getDataSchedule(
  groupName: string
): Promise<ScheduleWithTeachersAndDisciplineLink | null> {
  const repo = Repository.openConnection();
  const [schedule, group] = await repo.batch([
    repo.schedule().getSchedule(groupName),
    repo.groups().findByName(groupName),
  ]);

  if (group === null) {
    return null;
  }

  const now = Date.now();

  if (
    schedule === null ||
    now - schedule.lastUpdateTime > SCHEDULE_INVALIDATE_TIME
  ) {
    const campusSchedule = await getLessons(group.campusId);

    const [teachers, disciplines] = await Promise.all([
      getTeachers(getUniqueTeachers(campusSchedule)),
      repo.disciplines().getByNames(getUniqueLessonNames(campusSchedule)),
    ]);

    const { weeks } = campusScheduleToDataSchedule(
      campusSchedule,
      teachers,
      disciplines
    );

    const [links] = await repo.batch([
      repo.schedule().getLinks(groupName),
      repo.schedule().insertPlaceholder(groupName),
      repo.schedule().updateLastUpdateTime(groupName, now),
      ...repo.schedule().upsertWeeks({ groupName, weeks }),
      ...repo.scheduleTeachers().insertFromSchedule({ weeks }),
    ]);

    return { groupName, weeks, links, lastUpdateTime: now };
  }

  return schedule;
}

export async function getScheduleForGroup(
  groupName: string
): Promise<ApiSchedule | null> {
  const dataSchedule = await getDataSchedule(groupName);
  if (dataSchedule === null) {
    return null;
  }

  return dataScheduleToApiSchedule(dataSchedule);
}
