import { UpdateScheduleLinksPayload } from '@/api/schedule/payloads';
import { Schedule } from '@/api/schedule/types';

export function scheduleToUpdateLinksPayload(
  value: Schedule
): UpdateScheduleLinksPayload {
  const result: UpdateScheduleLinksPayload = {};

  for (const week of value.weeks) {
    for (const { lessons } of week) {
      for (const { type, name, teacher, link } of lessons) {
        if (link !== undefined) {
          result[`${type}-${name}-${teacher.name}`] = link;
        }
      }
    }
  }

  return result;
}
