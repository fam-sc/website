import { expect, test } from 'vitest';

import { contentToModuleExport } from '.';

test.each<[string, string]>([
  ['123', 'export default function _({}) { return `123` }'],
  ['123 ${name}', 'export default function _({name}) { return `123 ${name}` }'],
  [
    '123 ${name} ${name2}',
    'export default function _({name,name2}) { return `123 ${name} ${name2}` }',
  ],
  [
    '123 ${name} ${name}',
    'export default function _({name}) { return `123 ${name} ${name}` }',
  ],
])('contentToModuleExport', (input, expected) => {
  const actual = contentToModuleExport(input, 'text');

  expect(actual).toEqual(expected);
});
