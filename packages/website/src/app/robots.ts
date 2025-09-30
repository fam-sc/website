import { Robots } from '@sc-fam/shared';

export default (mode: string): Robots => {
  return mode === 'production'
    ? {
        Sitemap: 'https://sc-fam.org/sitemap.xml',
        Allow: '/',
        'User-agent': '*',
      }
    : { Disallow: '/' };
};
