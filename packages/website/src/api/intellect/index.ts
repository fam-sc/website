// https://github.com/kpi-ua/intellect.kpi.ua/blob/fa831853f7b3308c2487a27fe17bb104511e7883/src/api/teacher.ts

import querystring from 'node:querystring';
import { Schema, z } from 'zod';

import { ApiResponse, Lecturer, lecturer } from './types';

import { fetchObject } from '@shared/fetch';

async function apiRequest<T>(path: string, schema: Schema<T>): Promise<T> {
  const response = await fetchObject<ApiResponse<T>>(
    `https://api.campus.kpi.ua/intellect/v2${path}`
  );

  return schema.parse(response.data);
}

export async function findTeacherByName(
  value: string
): Promise<Lecturer | undefined> {
  const [firstLecturer] = await apiRequest(
    `/find?${querystring.stringify({ value })}`,
    z.array(lecturer)
  );

  return firstLecturer;
}
