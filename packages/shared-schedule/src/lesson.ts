import { LessonType } from './types';

export function lessonId(
  type: LessonType,
  lessonName: string,
  teacherName: string
): string {
  return `${type}-${lessonName}-${teacherName}`;
}
