import { Repository } from '@data/repo';

import { getCurrentTime } from '@shared/api/campus';
import { BotController } from './controller';
import { ScheduleWithTeachers } from '@data/types/schedule';

function getUniqueGroups(users: { academicGroup: string }[]): string[] {
  const result = new Set<string>();

  for (const user of users) {
    result.add(user.academicGroup);
  }

  return [...result];
}

async function getScheduleMap(
  repo: Repository,
  groups: string[]
): Promise<Map<string, ScheduleWithTeachers>> {
  const schedules = await Promise.all(
    groups.map((group) => {
      return repo.schedule().findByGroupWithTeachers(group).get();
    })
  );

  const result = new Map<string, ScheduleWithTeachers>();

  for (const schedule of schedules) {
    if (schedule !== null) {
      result.set(schedule.groupCampusId, schedule);
    }
  }

  return result;
}

export async function handleOnTime(
  time: { hour: number; minute: number },
  env: Env
) {
  const timeBreakpoint = `${time.hour}:${time.minute}`;
  const controller = new BotController(env);

  const repo = Repository.openConnection();

  const { currentWeek, currentDay } = await getCurrentTime();

  const users = await repo.users().findAllUsersWithLinkedTelegram();

  const groups = getUniqueGroups(users);
  const schedules = await getScheduleMap(repo, groups);

  for (const { academicGroup, telegramUserId } of users) {
    const schedule = schedules.get(academicGroup);
    if (schedule === undefined) {
      continue;
    }

    const week = schedule.weeks[currentWeek - 1];
    const day = week[currentDay - 1];

    // It might be undefined if the index is out of bounds.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (day === undefined) {
      continue;
    }

    const lessons = day.lessons.filter(
      (lesson) => lesson.time === timeBreakpoint
    );

    if (telegramUserId !== null && lessons.length > 0) {
      await controller.handleTimeTrigger(telegramUserId, lessons);
    }
  }
}
