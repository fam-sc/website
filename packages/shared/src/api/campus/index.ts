import { array, ZodMiniType } from 'zod/v4-mini';

import { fetchObject } from '../../fetch';
import { currentTime, group, lessonSchedule } from './schema.js';
import { CurrentTime, Group, LessonSchedule } from './types.js';

async function apiRequest<T>(path: string, schema: ZodMiniType<T>): Promise<T> {
  const result = await fetchObject(`https://api.campus.kpi.ua${path}`);

  return schema.parse(result);
}

export function getGroups(): Promise<Group[]> {
  return apiRequest('/schedule/groups', array(group));
}

export function getLessons(groupId: string): Promise<LessonSchedule> {
  return apiRequest(`/schedule/lessons?groupId=${groupId}`, lessonSchedule);
}

export function getCurrentTime(): Promise<CurrentTime> {
  return apiRequest(`/time/current`, currentTime);
}
