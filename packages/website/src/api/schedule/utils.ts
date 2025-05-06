import { Schedule } from './types';
import type { UpdateScheduleLinksPayload } from './update';

export function scheduleToUpdateLinksPayload(
  value: Schedule
): UpdateScheduleLinksPayload {
  const result: UpdateScheduleLinksPayload = {};

  for (const week of value.weeks) {
    for (const { lessons } of week) {
      for (const { type, name, teacher, link } of lessons) {
        result[`${type}-${name}-${teacher.name}`] = link ?? null;
      }
    }
  }

  return result;
}
