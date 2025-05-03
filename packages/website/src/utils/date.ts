export function formatDateTime(date: Date) {
  return date.toLocaleString('uk-UA', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}
