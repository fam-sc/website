import { coerce, iso, minLength, object, pipe, string } from 'zod/v4-mini';

const nonEmptyString = string().check(minLength(1));
const date = pipe(iso.date(), coerce.date());

export const exportSchedulePayload = object({
  title: nonEmptyString,
  description: nonEmptyString,
  colorId: nonEmptyString,
  startDate: date,
  endDate: date,
});
