import { expect, test } from 'vitest';

import {
  ApproveUserAction,
  createApproveUserCallback,
  isApproveUserCallbackByPrefix,
  parseApproveUserCallback,
} from './newUser';

test.each<[ApproveUserAction]>([['approve'], ['disapprove']])(
  'two-way parse',
  (action) => {
    const userId = 1;
    const callback = createApproveUserCallback(userId, action);

    expect(isApproveUserCallbackByPrefix(callback)).toBe(true);

    const actual = parseApproveUserCallback(callback);

    expect(actual).toEqual({ userId, action });
  }
);
