import { ImageSize } from '@sc-fam/shared/image';
import { resizeImage } from 'virtual:api/media/resize';

import { MediaTransaction } from './transaction';
import { MediaSubPathWithImageSize } from './types';

export async function putMultipleSizedImages(
  env: Env,
  path: MediaSubPathWithImageSize,
  content: Uint8Array,
  sizes: ImageSize[],
  mediaTransaction: MediaTransaction
): Promise<void> {
  await Promise.all(
    sizes.map(async ({ width, height }) => {
      const result = await resizeImage(env, content, width, height);

      mediaTransaction.put(`${path}/${width}`, result, {
        httpMetadata: { contentType: 'image/png' },
      });
    })
  );
}
