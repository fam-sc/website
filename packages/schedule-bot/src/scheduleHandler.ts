import { Repository } from '@data/repo';
import { User } from '@data/types/user';
import { getCurrentTime } from '@shared/api/campus';
import { CurrentTime, Time, timeBreakpoints } from '@shared/api/campus/types';
import { getTrueCurrentTime } from '@shared/api/time';
import { findNearestTimePoint } from '@shared/chrono/time';
import { getScheduleForGroup } from '@shared-schedule/get';
import { Schedule } from '@shared-schedule/types';

import { BotController } from './controller';

function getUniqueGroups(users: { academicGroup: string }[]): Set<string> {
  const result = new Set<string>();

  for (const user of users) {
    result.add(user.academicGroup);
  }

  return result;
}

async function getScheduleMap(
  groups: Set<string>
): Promise<Record<string, Schedule>> {
  const schedules = await Promise.all(
    [...groups].map((group) => getScheduleForGroup(group))
  );

  const result: Record<string, Schedule> = {};

  for (const schedule of schedules) {
    result[schedule.groupCampusId] = schedule;
  }

  return result;
}

export async function handleOnCronEvent(env: Env) {
  const now = await getTrueCurrentTime('Europe/Kyiv');
  const time = findNearestTimePoint(
    timeBreakpoints,
    `${now.getHours()}:${now.getMinutes()}`
  );

  if (time !== undefined) {
    await handleOnTime(time, env);
  }
}

async function handleOnTime(timeBreakpoint: Time, env: Env) {
  const controller = new BotController(env);

  const repo = Repository.openConnection();

  const currentTime = await getCurrentTime();
  const users = await repo.users().findAllUsersWithLinkedTelegram();

  const schedules = await getScheduleMap(getUniqueGroups(users));

  await Promise.all(
    users.map((user) =>
      handleUser(
        controller,
        user,
        schedules[user.academicGroup],
        currentTime,
        timeBreakpoint
      )
    )
  );
}

async function handleUser(
  controller: BotController,
  { id, telegramUserId }: Pick<User, 'id' | 'telegramUserId'>,
  schedule: Schedule,
  { currentWeek, currentDay }: CurrentTime,
  now: Time
) {
  try {
    const week = schedule.weeks[currentWeek - 1];
    const day = week[currentDay - 1];

    // It might be undefined if the index is out of bounds.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (day === undefined) {
      return;
    }

    const lessons = day.lessons.filter((lesson) => lesson.time === now);

    if (telegramUserId !== null && lessons.length > 0) {
      await controller.handleTimeTrigger(telegramUserId, lessons);
    }
  } catch (error: unknown) {
    console.error(
      `time = ${now}; userId = ${id}; tgUserId = ${telegramUserId}`,
      error
    );
  }
}
