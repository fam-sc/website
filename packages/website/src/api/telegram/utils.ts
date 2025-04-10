const TME_PREFIX = 'https://t.me/';

export function isTelegramUrl(url: string): boolean {
  return url.startsWith(TME_PREFIX);
}

// Parses URL's of type "https://t.me/abc" to "@abc"
export function urlToChatId(url: string): string {
  if (isTelegramUrl(url)) {
    return `@${url.slice(TME_PREFIX.length)}`;
  }

  throw new Error('Invalid format');
}
