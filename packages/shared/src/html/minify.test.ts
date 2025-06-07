import { expect, test } from 'vitest';
import { minifyHTML, minifyInlineCss } from './minify';

test.each<[string, string]>([
  [
    `<!DOCTYPE html>
  <html>
    <head>
      <title>Title</title>
    </head>
    <body>
    content
    </body>
  </html>`,
    '<!DOCTYPE html><html><head><title>Title</title></head><body>content</body></html>',
  ],
  [
    `<!DOCTYPE html>
  <html>
    <head>
      <title>Title</title>
    </head>
    <body>
      <p>     123    </p>
    </body>
  </html>`,
    '<!DOCTYPE html><html><head><title>Title</title></head><body><p>123</p></body></html>',
  ],
  [
    `<!DOCTYPE html>
  <html>
    <head>
      <title>Title</title>
    </head>
    <body>
      <p style="background-color: #111;    color: #fff;">     123    </p>
    </body>
  </html>`,
    '<!DOCTYPE html><html><head><title>Title</title></head><body><p style="background-color:#111;color:#fff;">123</p></body></html>',
  ],
])('minifyHTML', (input, expected) => {
  const actual = minifyHTML(input);

  expect(actual).toEqual(expected);
});

test.each<[string, string]>([
  ['', ''],
  ['color: white;', 'color:white;'],
  ['color:white;', 'color:white;'],
  ['color:  white  ; background:   black  ;', 'color:white;background:black;'],
  ['color:white', 'color:white;'],
])('minifyInlineCss', (input, expected) => {
  const actual = minifyInlineCss(input);

  expect(actual).toEqual(expected);
});
