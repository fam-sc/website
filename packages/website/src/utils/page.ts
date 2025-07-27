export function createPageUrl(prefix: string, page: number): string {
  return page === 1 ? prefix : `${prefix}?page=${page}`;
}
