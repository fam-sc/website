import { lessonType } from '@/api/schedule/types';
import { UpdateScheduleLinksPayload } from '@/api/schedule/payloads';

function isValidLessonId(value: unknown): boolean {
  if (value !== null) {
    if (typeof value !== 'string') {
      return false;
    }

    const parts = value.split('-', 3);
    if (parts.length !== 3) {
      return false;
    }

    return lessonType.safeParse(parts[0]).success;
  }

  return true;
}

export function isValidPayload(
  payload: unknown
): payload is UpdateScheduleLinksPayload {
  if (typeof payload === 'object') {
    for (const [key, value] of Object.entries(payload as object)) {
      if (!isValidLessonId(key) || typeof value !== 'string') {
        return false;
      }
    }

    return true;
  }

  return false;
}
