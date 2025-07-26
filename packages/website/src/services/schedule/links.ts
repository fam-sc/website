import { lessonId, Schedule } from '@sc-fam/shared-schedule';

import { UpdateScheduleLinksPayload } from '@/api/schedule/payloads';

export function scheduleToUpdateLinksPayload(
  value: Schedule
): UpdateScheduleLinksPayload {
  const result: UpdateScheduleLinksPayload = {};

  for (const week of value.weeks) {
    for (const { lessons } of week) {
      for (const { type, name, teacher, link } of lessons) {
        if (link !== undefined) {
          result[lessonId(type, name, teacher.name)] = link;
        }
      }
    }
  }

  return result;
}
