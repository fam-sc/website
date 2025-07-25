import { Repository, User } from '@sc-fam/data';
import { getCurrentTime } from '@sc-fam/shared/api/campus/index.js';
import { CurrentTime, Time } from '@sc-fam/shared/api/campus/types.js';
import { getTrueCurrentTime } from '@sc-fam/shared/api/time/index.js';
import { findNearestTimePoint } from '@sc-fam/shared/chrono';
import {
  getScheduleForGroup,
  Schedule,
  timeBreakpoints,
} from '@sc-fam/shared-schedule';

import { handleTimeTrigger } from './controller';

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
    if (schedule) {
      result[schedule.groupCampusId] = schedule;
    }
  }

  return result;
}

export async function handleOnCronEvent() {
  const now = await getTrueCurrentTime('Europe/Kyiv');
  const time = findNearestTimePoint(
    timeBreakpoints,
    `${now.getHours()}:${now.getMinutes()}`
  );

  if (time !== undefined) {
    await handleOnTime(time);
  }
}

async function handleOnTime(timeBreakpoint: Time) {
  const repo = Repository.openConnection();

  const currentTime = await getCurrentTime();
  const users = await repo.users().findAllUsersWithLinkedScheduleBot();

  const schedules = await getScheduleMap(getUniqueGroups(users));

  await Promise.all(
    users.map((user) =>
      handleUser(
        user,
        schedules[user.academicGroup],
        currentTime,
        timeBreakpoint
      )
    )
  );
}

async function handleUser(
  { id, scheduleBotUserId }: Pick<User, 'id' | 'scheduleBotUserId'>,
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

    if (scheduleBotUserId !== null && lessons.length > 0) {
      await handleTimeTrigger(scheduleBotUserId, lessons);
    }
  } catch (error: unknown) {
    console.error(
      `time = ${now}; userId = ${id}; tgUserId = ${scheduleBotUserId}`,
      error
    );
  }
}
