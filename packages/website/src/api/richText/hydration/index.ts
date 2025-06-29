import { randomUUID } from 'node:crypto';

import { resolveImageSizes } from '@shared/image/breakpoints';
import { getImageSize } from '@shared/image/size';
import { RichTextString } from '@shared/richText/types';

import { MediaFileSubPath } from '@/api/media';
import { putMultipleSizedImages } from '@/api/media/multiple';
import { MediaTransaction } from '@/api/media/transaction';

import { getImageSizeMap, ImageSizeMap } from './analysis';

export type HydrationContext = {
  env: Env;
  mediaTransaction: MediaTransaction;
  files: File[];
  previous?: RichTextString;
};

export function hydrateRichText(
  current: RichTextString,
  context: HydrationContext
): Promise<RichTextString> {
  const imageSizeMap = context.previous
    ? getImageSizeMap(context.previous)
    : {};

  return hydrateRichTextBase(current, imageSizeMap, context);
}

async function hydrateRichTextBase(
  text: RichTextString,
  imageSizeMap: ImageSizeMap,
  context: HydrationContext
): Promise<RichTextString> {
  if (typeof text === 'string') {
    return text;
  }

  if (Array.isArray(text)) {
    const result = await Promise.all(
      text.map((child) => hydrateRichTextBase(child, imageSizeMap, context))
    );

    return result.flat();
  }

  switch (text.name) {
    case '#unsized-image': {
      const sizes = imageSizeMap[text.filePath];
      if (sizes === undefined) {
        throw new Error('Unknown unsized image');
      }

      return { name: '#image', filePath: text.filePath, sizes };
    }
    case '#placeholder-image': {
      const file = context.files.at(text.id);
      if (file === undefined) {
        throw new Error('Unknown placeholder image');
      }

      const dataContent = await file.bytes();
      const imageSize = getImageSize(dataContent);
      const sizes = resolveImageSizes(imageSize);

      const id = randomUUID();
      const path: MediaFileSubPath = `rich-text-image/${id}`;

      await putMultipleSizedImages(
        context.env,
        path,
        dataContent,
        sizes,
        context.mediaTransaction
      );

      return { name: '#image', filePath: path, sizes };
    }
    default: {
      return text;
    }
  }
}
