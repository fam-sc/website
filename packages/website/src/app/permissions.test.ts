import { UserRole } from '@data/types/user';
import { expect, test } from 'vitest';
import { getMinRoleForRoute } from './permissions';

test.each<[string, UserRole | null]>([
  ['/page', null],
  ['/events', null],
  ['/events/+', UserRole.ADMIN],
  ['/gallery', null],
  ['/gallery/upload', UserRole.ADMIN],
  ['/polls', null],
  ['/polls/123', UserRole.STUDENT],
  ['/polls/123/info', UserRole.ADMIN],
])('getMinRoleForRoute', (path, expected) => {
  const actual = getMinRoleForRoute(path);

  expect(actual, `path: ${path}`).toEqual(expected);
});
