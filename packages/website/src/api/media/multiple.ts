import { ImageData } from '@sc-fam/data';
import { resizeImage } from 'virtual:api/media/resize';

import { MediaTransaction } from './transaction';
import { MediaSubPathWithImageSize } from './types';

export async function putMultipleSizedImages(
  env: Env,
  path: MediaSubPathWithImageSize,
  content: Uint8Array,
  imageData: ImageData,
  mediaTransaction: MediaTransaction
): Promise<void> {
  await Promise.all(
    imageData.sizes.map(async ({ width, height }) => {
      const result = await resizeImage(
        env,
        content,
        width,
        height,
        imageData.format
      );

      mediaTransaction.put(`${path}/${width}.${imageData.format}`, result, {
        httpMetadata: { contentType: 'image/png' },
      });
    })
  );
}
