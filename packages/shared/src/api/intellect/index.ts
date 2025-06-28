// https://github.com/kpi-ua/intellect.kpi.ua/blob/fa831853f7b3308c2487a27fe17bb104511e7883/src/api/teacher.ts

import { array, ZodMiniType } from 'zod/v4-mini';

import { ApiResponse, Lecturer, lecturer } from './types';
import { fetchObject } from '../../fetch';

const BASE_URL = `https://api.campus.kpi.ua/intellect/v2`;

async function apiRequest<T>(url: URL, schema: ZodMiniType<T>): Promise<T> {
  const response = await fetchObject<ApiResponse<T>>(url);

  return schema.parse(response.data);
}

export async function findTeacherByName(
  value: string
): Promise<Lecturer | undefined> {
  const url = new URL(`${BASE_URL}/find`);
  url.searchParams.set('value', value);

  const [firstLecturer] = await apiRequest(url, array(lecturer));

  return firstLecturer;
}
