import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { Image, ImageProps } from '.';

function renderImage(props: ImageProps): HTMLImageElement {
  return render(<Image {...props} />).container.children[0] as HTMLImageElement;
}

function createSource(name: string): string {
  return `http://localhost:0/${name}`;
}

test('one image', () => {
  const src = createSource('123');
  const alt = 'alt';

  const img = renderImage({ src, alt });

  expect(img.src).toBe(src);
  expect(img.alt).toBe(alt);
});

test('multiple/empty', () => {
  const img = renderImage({ multiple: [] });

  expect(img).toBeUndefined();
});

test('multiple/one', () => {
  const src = createSource('img-1');
  const width = 4;
  const height = 8;

  const img = renderImage({
    multiple: [{ src, width, height }],
  });

  expect(img.src).toBe(src);
  expect(img.width).toBe(width);
  expect(img.height).toBe(height);
  expect(img.srcset).toBe(`${src} ${width}w`);
  expect((img as { multiple?: unknown }).multiple).toBeUndefined();
});

test('multiple/two', () => {
  const firstSrc = createSource('img-1');
  const lastSrc = createSource('img-2');
  const lastWidth = 16;
  const lastHeight = 32;

  const img = renderImage({
    multiple: [
      { src: firstSrc, width: 4, height: 8 },
      { src: lastSrc, width: lastWidth, height: lastHeight },
    ],
  });

  expect(img.src).toBe(lastSrc);
  expect(img.width).toBe(lastWidth);
  expect(img.height).toBe(lastHeight);
  expect(img.srcset).toBe(`${firstSrc} 4w,${lastSrc} ${lastWidth}w`);
  expect((img as { multiple?: unknown }).multiple).toBeUndefined();
});
