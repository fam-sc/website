import { describe, expect, test } from 'vitest';

import { formPersonName } from './person';

describe('formPersonName', () => {
  test('with parent name', () => {
    expect(formPersonName('Данило', 'Тавров', 'Юрійович')).toEqual(
      'Тавров Данило Юрійович'
    );
  });

  test('without parent name', () => {
    expect(formPersonName('Данило', 'Тавров', null)).toEqual('Тавров Данило');
  });
});
