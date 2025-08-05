function formatTwoDigit(value: number) {
  return value.toString().padStart(2, '0');
}

export function formatDateToReccurenceRuleDate(value: Date): string {
  return `${value.getUTCFullYear()}${formatTwoDigit(value.getUTCMonth() + 1)}${formatTwoDigit(value.getUTCDate())}`;
}
