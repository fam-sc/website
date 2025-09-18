import { Day, Repository, ScheduleBotUser } from '@sc-fam/data';
import { getCurrentTime } from '@sc-fam/shared/api/campus/index.js';
import { CurrentTime } from '@sc-fam/shared/api/campus/types.js';
import { findNearestTimePoint } from '@sc-fam/shared/chrono';
import { getLocalNow } from '@sc-fam/shared/chrono/time.js';
import {
  DaySchedule,
  getScheduleForGroup,
  Schedule,
  Time,
  timeBreakpoints,
} from '@sc-fam/shared-schedule';

import { handleLessonNotification } from './controller';
import { getDaySeconds } from './time';

function getUniqueGroups(users: { academicGroup: string }[]): Set<string> {
  const result = new Set<string>();

  for (const user of users) {
    result.add(user.academicGroup);
  }

  return result;
}

async function getSchedule(groupName: string): Promise<Schedule | null> {
  if (DEV) {
    const week = ([1, 2, 3, 4, 5, 6, 7] as Day[]).map(
      (day): DaySchedule => ({
        day,
        lessons: [1, 2].map((index) => ({
          name: `Lesson ${index}`,
          place: `Place ${index}`,
          teacher: { name: 'Teacher', link: 'https://google.com' },
          time: '08:30',
          type: 'lec',
          link: 'https://google.com',
        })),
      })
    );

    return { groupName, weeks: [week, week] };
  }

  return getScheduleForGroup(groupName);
}

export async function getCurrentDayLessons(group: string) {
  const schedule = await getSchedule(group);
  if (schedule === null) {
    return null;
  }

  const { currentWeek, currentDay } = await getCurrentTime();
  const day = schedule.weeks[currentWeek - 1][currentDay];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (day == undefined) {
    return null;
  }

  return day.lessons;
}

async function getScheduleMap(
  groups: Set<string>
): Promise<Record<string, Schedule>> {
  const schedules = await Promise.all(
    [...groups].map((group) => getSchedule(group))
  );

  const result: Record<string, Schedule> = {};

  for (const schedule of schedules) {
    if (schedule) {
      result[schedule.groupName] = schedule;
    }
  }

  return result;
}

export async function handleOnCronEvent() {
  const now = getLocalNow('Europe/Kiev');

  const time = findNearestTimePoint(
    timeBreakpoints,
    `${now.getHours()}:${now.getMinutes()}`
  );

  if (time !== undefined) {
    await handleOnTime(time, now);
  }
}

async function handleOnTime(timeBreakpoint: Time, now: Date) {
  const repo = Repository.openConnection();

  const currentTime = await getCurrentTime();
  const users = await repo
    .scheduleBotUsers()
    .findAllUsersToSendNotification(getDaySeconds(now));

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
  { userId, telegramId }: Pick<ScheduleBotUser, 'userId' | 'telegramId'>,
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

    if (lessons.length > 0) {
      await handleLessonNotification(telegramId, lessons, userId !== null);
    }
  } catch (error: unknown) {
    console.error(
      `time = ${now}; userId = ${userId}; tgUserId = ${telegramId}`,
      error
    );
  }
}
