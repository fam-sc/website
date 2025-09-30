import { Repository } from '@sc-fam/data';
import { createSitemap, SitemapEntry } from '@sc-fam/shared/sitemap';
import { DataQuery } from '@sc-fam/shared-sql/builder';

type Collection<T> = {
  all: <K extends keyof T & string>(
    fields: K[] | '*'
  ) => DataQuery<Pick<T, K>[]>;
};

type SlugEntityDescriptor = {
  prefix: string;
  getCollection: (repo: Repository) => Collection<{ slug: string }>;
};

const slugEntities: SlugEntityDescriptor[] = [
  {
    prefix: 'events',
    getCollection: (repo) => repo.events(),
  },
  {
    prefix: 'guides',
    getCollection: (repo) => repo.guides(),
  },
  {
    prefix: 'polls',
    getCollection: (repo) => repo.polls(),
  },
];

const STATIC_ROUTES = [
  '',
  'privacy-policy',
  'schedule',
  'signin',
  'signup',
  'students',
];

async function getSitemap(): Promise<SitemapEntry[]> {
  const repo = Repository.openConnection();

  const slugRoutes = await Promise.all(
    slugEntities.map(async (descriptor) => {
      const values = await descriptor.getCollection(repo).all(['slug']).get();

      return values.map(({ slug }) => `${descriptor.prefix}/${slug}`);
    })
  );

  return [...STATIC_ROUTES, slugRoutes]
    .flat(2)
    .map((path) => ({ location: `https://sc-fam.org/${path}` }));
}

export async function updateSitemap(env: Env) {
  const entries = await getSitemap();
  const sitemap = createSitemap(entries);

  console.log(sitemap);

  await env.MEDIA_BUCKET.put('website/sitemap.xml', sitemap);
}
