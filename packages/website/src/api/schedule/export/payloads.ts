import { iso, minLength, object, string } from 'zod/v4-mini';

const nonEmptyString = string().check(minLength(1));
const date = iso.date();

export const exportSchedulePayload = object({
  title: nonEmptyString,
  colorId: nonEmptyString,
  startDate: date,
  endDate: date,
});
