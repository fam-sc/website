// Prepends protocol to the URL if it doesn't have any. By default, assumes https:
// google.com -> https://google.com
export function normalizeProtocol(input: string): string {
  if (!input.includes(':')) {
    return `https://${input}`;
  }

  return input;
}

// If the host is pma.fpm.kpi.ua make the url relative.
// Enables client navigation in rich text.
export function normalizeToRelative(url: string): string {
  const BASE = 'https://pma.fpm.kpi.ua';

  if (url.startsWith(BASE)) {
    const relative = url.slice(BASE.length);

    return relative.length === 0 ? '/' : relative;
  }

  return url;
}
