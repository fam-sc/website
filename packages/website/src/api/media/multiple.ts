import { ImageSize } from '@shared/image/types';
import { MediaTransaction } from './transaction';
import { resizeImage } from 'virtual:api/media/resize';
import { MediaFileSubPath } from '.';

export async function putMultipleSizedImages(
  env: Env,
  path: MediaFileSubPath,
  content: Uint8Array,
  sizes: ImageSize[],
  mediaTransaction: MediaTransaction
): Promise<void> {
  await Promise.all(
    sizes.map(async ({ width, height }) => {
      const result = await resizeImage(env, content, width, height);

      mediaTransaction.put(`${path}/${width}`, result);
    })
  );
}
