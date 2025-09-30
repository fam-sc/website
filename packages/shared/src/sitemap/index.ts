export type SitemapEntry = {
  location: string;
};

function entryToString(entry: SitemapEntry): string {
  return `<url><loc>${entry.location}</loc></url>`;
}

export function createSitemap(entries: SitemapEntry[]): string {
  const itemsContent = entries.map((entry) => entryToString(entry)).join('');

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${itemsContent}</urlset>`;
}
