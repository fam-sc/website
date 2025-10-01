import { PollRespondentAnswer } from '@sc-fam/data';
import { getLocalDate } from '@sc-fam/shared/chrono';
import { formatTwoDigit } from '@sc-fam/shared/string';

export function notUndefined<K extends keyof PollRespondentAnswer>(
  answer: PollRespondentAnswer,
  key: K
): NonNullable<PollRespondentAnswer[K]> {
  const value = answer[key];
  if (value === undefined) {
    throw new Error(`Invalid answer: no ${key}`);
  }

  return value;
}

export function formatDate(epoch: number): string {
  const localDate = getLocalDate(new Date(epoch), 'Europe/Kiev');

  return `${localDate.getUTCFullYear()}-${formatTwoDigit(localDate.getUTCMonth())}-${formatTwoDigit(localDate.getUTCDate())} ${formatTwoDigit(localDate.getUTCHours())}:${formatTwoDigit(localDate.getUTCMinutes())}`;
}
