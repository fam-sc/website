export type ScopePart = 'spreadsheets';

export function scope(...parts: ScopePart[]) {
  return parts
    .map((part) => `https://www.googleapis.com/auth/${part}`)
    .join(' ');
}
