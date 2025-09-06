import { StickerInfo, StickerSource } from './types';

const PREFIX = 'bot-flow/tg-sticker';

export async function listMediaStickers(
  bucket: R2Bucket
): Promise<StickerInfo[]> {
  const { objects } = await bucket.list({ prefix: PREFIX });

  return objects.map(({ key }) => {
    const dotIndex = key.lastIndexOf('.');
    const id = key.slice(PREFIX.length, dotIndex);

    return { id, source: key as StickerSource };
  });
}
