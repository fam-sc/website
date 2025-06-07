import { expect, test } from 'vitest';
import { ClassName, classNames } from './classNames';

test.each<[ClassName[], string]>([
  [[], ''],
  [['abc'], 'abc'],
  [['abc', 'class'], 'abc class'],
  [['abc', null, undefined, false], 'abc'],
  [['', 'abc'], 'abc'],
])('classNames', (input, expected) => {
  const actual = classNames(...input);

  expect(actual).toEqual(expected);
});
