import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { VarImage, VarImageProps } from '.';

function renderImage(props: VarImageProps): HTMLImageElement {
  return render(<VarImage {...props} />).container
    .children[0] as HTMLImageElement;
}

function createSource(name: string): string {
  return `http://localhost:0/${name}`;
}

test('string source', () => {
  const src = createSource('123');

  const img = renderImage({ image: src });

  expect(img.src).toBe(src);
});

test('ImageInfo source', () => {
  const src = createSource('123');
  const width = 4;
  const height = 8;

  const img = renderImage({ image: { src, width, height } });

  expect(img.src).toBe(src);
  expect(img.width).toBe(width);
  expect(img.height).toBe(height);
});

test('ImageInfo array source', () => {
  const firstSrc = createSource('img-1');
  const lastSrc = createSource('img-2');
  const lastWidth = 16;
  const lastHeight = 32;

  const img = renderImage({
    image: [
      { src: firstSrc, width: 4, height: 8 },
      { src: lastSrc, width: lastWidth, height: lastHeight },
    ],
  });

  expect(img.src).toBe(lastSrc);
  expect(img.width).toBe(lastWidth);
  expect(img.height).toBe(lastHeight);
  expect(img.srcset).toBe(`${firstSrc} 4w,${lastSrc} ${lastWidth}w`);
});

test('ImageInfo with sizes source', () => {
  const firstSrc = createSource('img-1');
  const lastSrc = createSource('img-2');
  const lastWidth = 16;
  const lastHeight = 32;

  const img = renderImage({
    image: {
      images: [
        { src: firstSrc, width: 4, height: 8 },
        { src: lastSrc, width: lastWidth, height: lastHeight },
      ],
      sizes: { 500: '10vw', default: '20vw' },
    },
  });

  expect(img.src).toBe(lastSrc);
  expect(img.width).toBe(lastWidth);
  expect(img.height).toBe(lastHeight);
  expect(img.srcset).toBe(`${firstSrc} 4w,${lastSrc} ${lastWidth}w`);
  expect(img.sizes).toBe('(min-width: 500px) 10vw, 20vw');
});
