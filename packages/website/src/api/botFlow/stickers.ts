import { createErrorResponse } from '@sc-fam/shared';
import { getFileDownloadUrlById } from '@sc-fam/shared/api/telegram/utils.js';
import { TelegramBot } from 'telegram-standard-bot-api';
import { Sticker } from 'telegram-standard-bot-api/types';

import { StickerId } from './types';

type MediaStickerInfo = {
  key: string;
  etag: string | undefined;
};

export async function listMediaStickers(
  bucket: R2Bucket
): Promise<MediaStickerInfo[]> {
  const { objects } = await bucket.list({ prefix: `bot-flow/tg-sticker` });

  return objects.map(({ key, customMetadata }) => ({
    key,
    etag: customMetadata?.etag,
  }));
}

function getUrlExtension(url: string): string {
  const slashIndex = url.lastIndexOf('/');
  if (slashIndex !== -1) {
    const dotIndex = url.lastIndexOf('.');

    if (dotIndex >= slashIndex) {
      return url.slice(dotIndex + 1);
    }
  }

  return '';
}

export async function downloadStickers(
  bot: TelegramBot,
  botKey: string,
  bucket: R2Bucket,
  stickers: Sticker[],
  currentStickers: MediaStickerInfo[]
): Promise<StickerId[]> {
  const result = await Promise.all(
    stickers.map(async (sticker) => {
      const fileId = sticker.thumbnail?.file_id;

      if (fileId !== undefined) {
        const pathPrefix = `bot-flow/tg-sticker/${sticker.custom_emoji_id}`;
        const mediaSticker = currentStickers.find(({ key }) =>
          key.startsWith(pathPrefix)
        );

        const url = await getFileDownloadUrlById(bot, botKey, fileId);
        const extension = getUrlExtension(url);
        const filePath =
          extension.length > 0 ? `${pathPrefix}.${extension}` : pathPrefix;

        const headers = new Headers();
        if (mediaSticker?.etag) {
          headers.set('If-None-Match', mediaSticker.etag);
        }

        const response = await fetch(url, { headers });

        if (response.status === 200) {
          const etag = response.headers.get('ETag');

          const customMetadata: Record<string, string> = {};
          if (etag !== null) {
            customMetadata.etag = etag;
          }

          const body =
            import.meta.env.VITE_HOST === 'cf'
              ? response.body
              : await response.bytes();

          await bucket.put(filePath, body, {
            customMetadata,
            httpMetadata: { contentType: `image/${extension}` },
          });
        } else if (response.status !== 304) {
          throw await createErrorResponse(response);
        }

        return filePath as StickerId;
      }
    })
  );

  return result.filter((value) => value !== undefined);
}
