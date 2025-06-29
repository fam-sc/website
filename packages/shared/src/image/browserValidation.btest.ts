import { expect, test } from 'vitest';

import { isValidImageUrlForBrowser } from './browserValidation';

async function passImageThroughObjectUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const content = await response.blob();

  return URL.createObjectURL(content);
}

test('valid', async () => {
  const url = await passImageThroughObjectUrl(
    'https://i.imgur.com/gbt7JG7.jpg'
  );
  const actual = await isValidImageUrlForBrowser(url);

  expect(actual).toBe(true);
});

test('invalid', async () => {
  const content = new Blob([new Uint8Array([1, 2, 3])]);
  const url = URL.createObjectURL(content);

  const actual = await isValidImageUrlForBrowser(url);

  expect(actual).toBe(false);
});
