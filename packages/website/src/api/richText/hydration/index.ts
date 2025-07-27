import { randomUUID } from 'node:crypto';

import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';
import {
  getRichTextChildren,
  RichTextAtomNode,
  RichTextString,
} from '@sc-fam/shared/richText';

import { putMultipleSizedImages } from '@/api/media/multiple';
import { MediaTransaction } from '@/api/media/transaction';
import { MediaSubPathWithImageSize } from '@/api/media/types';

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

function hydrateRichTextBase(
  node: RichTextAtomNode,
  imageSizeMap: ImageSizeMap,
  context: HydrationContext
): Promise<RichTextAtomNode>;

function hydrateRichTextBase(
  node: RichTextString,
  imageSizeMap: ImageSizeMap,
  context: HydrationContext
): Promise<RichTextString>;

async function hydrateRichTextBase(
  node: RichTextString,
  imageSizeMap: ImageSizeMap,
  context: HydrationContext
): Promise<RichTextString> {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return hydrateRichTextArray(node, imageSizeMap, context);
  }

  switch (node.name) {
    case '#unsized-image': {
      const sizes = imageSizeMap[node.filePath];
      if (sizes === undefined) {
        throw new Error('Unknown unsized image');
      }

      return { name: '#image', filePath: node.filePath, sizes };
    }
    case '#placeholder-image': {
      const file = context.files.at(node.id);
      if (file === undefined) {
        throw new Error('Unknown placeholder image');
      }

      const dataContent = await file.bytes();
      const imageSize = getImageSize(dataContent);
      const sizes = resolveImageSizes(imageSize);

      const id = randomUUID();
      const path: MediaSubPathWithImageSize = `rich-text-image/${id}`;

      await putMultipleSizedImages(
        context.env,
        path,
        dataContent,
        sizes,
        context.mediaTransaction
      );

      return { name: '#image', filePath: path, sizes };
    }
    case '#image': {
      return node;
    }
    default: {
      const children = getRichTextChildren(node);
      const newChildren = await hydrateRichTextArray(
        children,
        imageSizeMap,
        context
      );

      return {
        ...node,
        children: children.length > 0 ? newChildren : undefined,
      };
    }
  }
}

async function hydrateRichTextArray(
  nodes: RichTextAtomNode[],
  imageSizeMap: ImageSizeMap,
  context: HydrationContext
): Promise<RichTextAtomNode[]> {
  const result: RichTextAtomNode[] = [];

  for (const node of nodes) {
    result.push(await hydrateRichTextBase(node, imageSizeMap, context));
  }

  return result;
}
