export function formatDateTime(date: Date) {
  return date.toLocaleString('uk-UA', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export function toLocalISOString(date: Date): string {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000
  ).toISOString();
}
