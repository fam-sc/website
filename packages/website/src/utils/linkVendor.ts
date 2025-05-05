export type LinkVendor = 'zoom';

export function detectLinkVendor(
  url: string | { host?: string | null }
): LinkVendor | undefined {
  try {
    const { host } = typeof url === 'string' ? new URL(url) : url;

    if (host?.endsWith('zoom.us')) {
      return 'zoom';
    }
  } catch {
    // Ignore possible exception from URL because of ill-formated href.
    // Return undefined anyway.
  }

  return undefined;
}
