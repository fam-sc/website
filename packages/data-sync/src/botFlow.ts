import { getFileDownloadUrlById } from '@sc-fam/shared/api/telegram/utils.js';
import { createErrorResponse } from '@sc-fam/shared/index.js';
import { createTelegramBot, TelegramBot } from 'telegram-standard-bot-api';
import { getForumTopicIconStickers } from 'telegram-standard-bot-api/methods';
import { Sticker } from 'telegram-standard-bot-api/types';

type MediaStickerInfo = {
  key: string;
  etag: string | undefined;
};

const MEDIA_PREFIX = 'bot-flow/tg-sticker';

async function listMediaStickers(
  bucket: R2Bucket
): Promise<MediaStickerInfo[]> {
  const { objects } = await bucket.list({ prefix: MEDIA_PREFIX });

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

function downloadStickers(
  bot: TelegramBot,
  botKey: string,
  bucket: R2Bucket,
  stickers: Sticker[],
  currentStickers: MediaStickerInfo[]
) {
  return Promise.all(
    stickers.map(async (sticker) => {
      const fileId = sticker.thumbnail?.file_id;

      if (fileId !== undefined) {
        const pathPrefix = `${MEDIA_PREFIX}/${sticker.custom_emoji_id}`;
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

          await bucket.put(filePath, response.body, {
            customMetadata,
            httpMetadata: { contentType: `image/${extension}` },
          });
        } else if (response.status !== 304) {
          throw await createErrorResponse(response);
        }
      }
    })
  );
}

export async function syncBotFlow(env: Env) {
  const botKey = env.TG_BOT_KEY;
  const bot = createTelegramBot({ apiKey: botKey });
  const [stickers, mediaStickers] = await Promise.all([
    bot(getForumTopicIconStickers()),
    listMediaStickers(env.MEDIA_BUCKET),
  ]);

  await downloadStickers(
    bot,
    botKey,
    env.MEDIA_BUCKET,
    stickers,
    mediaStickers
  );
}
