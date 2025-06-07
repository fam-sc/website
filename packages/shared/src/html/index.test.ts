import { expect, test } from 'vitest';
import { isTextNode, transformArrayAttributesToObject } from '.';
import { defaultTreeAdapter } from 'parse5';
import { Attribute } from './types';

test.each([
  [defaultTreeAdapter.createTextNode('1'), true],
  [defaultTreeAdapter.createCommentNode(''), false],
])('isTextNode', (node, expected) => {
  const actual = isTextNode(node);

  expect(actual).toEqual(expected);
});

test.each<[Attribute[], Record<string, string>]>([
  [[], {}],
  [
    [
      { name: 'attr1', value: 'value1' },
      { name: 'attr2', value: 'value2' },
    ],
    { attr1: 'value1', attr2: 'value2' },
  ],
])('transformArrayAttributesToObject', (input, expected) => {
  const actual = transformArrayAttributesToObject(input);

  expect(actual).toEqual(expected);
});
