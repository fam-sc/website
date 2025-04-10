import CSS from 'csstype';
import { expect, test } from 'vitest';

import { parseInlineStyle } from './inlineStyleParser';

test.each<[string, CSS.Properties]>([
  [
    'width: 200px; float: left; margin-right: 10px; height: 285px;',
    { width: '200px', float: 'left', marginRight: '10px', height: '285px' },
  ],
  ['font-size:14px;', { fontSize: '14px' }],
  [
    'display: block; margin-left: auto; margin-right: auto;',
    { display: 'block', marginLeft: 'auto', marginRight: 'auto' },
  ],
  [
    'line-height: 15pt; background-position: initial initial; background-repeat: initial initial;',
    {
      lineHeight: '15pt',
      backgroundPosition: 'initial initial',
      backgroundRepeat: 'initial initial',
    },
  ],
])('parse', (input, expected) => {
  const actual = parseInlineStyle(input);

  expect(actual).toEqual(expected);
});
