type DateLike = Date | string | number;

function parseDate(date: DateLike): Date {
  return date instanceof Date ? date : new Date(date);
}

export function formatDate(date: DateLike) {
  return parseDate(date).toLocaleDateString('uk-UA', { dateStyle: 'long' });
}

export function formatDateTime(date: DateLike) {
  return parseDate(date).toLocaleString('uk-UA', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export function toLocalISOString(date: Date): string {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000
  ).toISOString();
}
