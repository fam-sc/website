import { Repository } from '@data/repo';

import { getCurrentTime } from '@shared/api/campus';
import { BotController } from './controller';

function getUniqueGroups(users: { academicGroup: string }[]): string[] {
  const result = new Set<string>();

  for (const user of users) {
    result.add(user.academicGroup);
  }

  return [...result];
}

export async function handleOnTime(
  time: { hour: number; minute: number },
  env: Env
) {
  const timeBreakpoint = `${time.hour}:${time.minute}`;
  const controller = new BotController(env);

  await using repo = await Repository.openConnection(
    env.MONGO_CONNECTION_STRING
  );

  const { currentWeek, currentDay } = await getCurrentTime();

  const users = await repo
    .users()
    .findAllUsersWithLinkedTelegram()
    .project<{
      academicGroup: string;
      telegramUserId: number;
    }>({ academicGroup: 1, telegramUserId: 1 })
    .toArray();

  const groups = getUniqueGroups(users);
  const schedules = await repo
    .schedule()
    .findSchedulesWithGroupIds(groups)
    .toArray();

  for (const user of users) {
    const schedule = schedules.find(
      (value) => value.groupCampusId === user.academicGroup
    );
    if (schedule === undefined) {
      continue;
    }

    const week = currentWeek === 1 ? schedule.firstWeek : schedule.secondWeek;
    const day = week[currentDay - 1];

    // It might be undefined if the index is out of bounds.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (day === undefined) {
      continue;
    }

    const lessons = day.lessons.filter(
      (lesson) => lesson.time === timeBreakpoint
    );

    if (lessons.length > 0) {
      await controller.handleTimeTrigger(user.telegramUserId, lessons);
    }
  }
}
