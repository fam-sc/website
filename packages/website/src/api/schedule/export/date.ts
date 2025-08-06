import { formatTwoDigit } from '@sc-fam/shared/string';

export function formatDateToReccurenceRuleDate(value: Date): string {
  return `${value.getUTCFullYear()}${formatTwoDigit(value.getUTCMonth() + 1)}${formatTwoDigit(value.getUTCDate())}`;
}
