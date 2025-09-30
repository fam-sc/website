import { expect, test } from 'vitest';

import { generateRobots } from './robots';

test('generateRobots', () => {
  const actual = generateRobots({
    Allow: '1',
    Disallow: undefined,
    Sitemap: '2',
  });

  expect(actual).toEqual('Allow: 1\nSitemap: 2');
});
