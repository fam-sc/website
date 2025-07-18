import { enum as zodEnum } from 'zod/v4-mini';

export const lessonType = zodEnum(['lec', 'prac', 'lab']);
