import { UpdateScheduleLinksPayload } from './payloads';
import { LessonType } from './types';

function isValidLessonType(value: string): value is LessonType {
  switch (value) {
    case 'prac':
    case 'lec':
    case 'lab': {
      return true;
    }
  }

  return false;
}

function isValidLessonId(value: unknown): boolean {
  if (value !== null) {
    if (typeof value !== 'string') {
      return false;
    }

    const parts = value.split('-', 3);
    if (parts.length !== 3) {
      return false;
    }

    return isValidLessonType(parts[0]);
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
