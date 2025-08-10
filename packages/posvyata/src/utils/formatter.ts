import { formatTwoDigit } from '@sc-fam/shared/string';

import { DateInterval } from '@/hooks/useCountdown';

export function formatCountdown(value: DateInterval): string {
  return `${formatTwoDigit(value.days)}:${formatTwoDigit(value.hours)}:${formatTwoDigit(value.minutes)}`;
}
