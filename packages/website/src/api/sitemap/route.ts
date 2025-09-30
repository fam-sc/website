import { notFound } from '@sc-fam/shared';

export async function handleSitemapRequest(env: Env): Promise<Response> {
  const object = await env.MEDIA_BUCKET.get('website/sitemap.xml');

  if (object === null) {
    return notFound();
  }

  return new Response(object.body);
}
