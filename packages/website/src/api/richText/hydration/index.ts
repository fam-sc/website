import { randomUUID } from 'node:crypto';

import {
  getRichTextChildren,
  RichTextAtomNode,
  RichTextString,
} from '@sc-fam/shared/richText';

import { resolveImageData } from '@/api/media/imageData';

import { putMultipleSizedImages } from '../../media/multiple';
import { MediaTransaction } from '../../media/transaction';
import { MediaSubPathWithImageSize } from '../../media/types';
import { getImageSizeMap, ImageDataMap } from './analysis';

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
  imageSizeMap: ImageDataMap,
  context: HydrationContext
): Promise<RichTextAtomNode>;

function hydrateRichTextBase(
  node: RichTextString,
  imageSizeMap: ImageDataMap,
  context: HydrationContext
): Promise<RichTextString>;

async function hydrateRichTextBase(
  node: RichTextString,
  imageSizeMap: ImageDataMap,
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
      const imageData = imageSizeMap[node.filePath];
      if (imageData === undefined) {
        throw new Error('Unknown unsized image');
      }

      return { name: '#image', filePath: node.filePath, ...imageData };
    }
    case '#placeholder-image': {
      const file = context.files.at(node.id);
      if (file === undefined) {
        throw new Error('Unknown placeholder image');
      }

      const dataContent = await file.bytes();
      const imageData = resolveImageData(dataContent);

      const id = randomUUID();
      const path: MediaSubPathWithImageSize = `rich-text-image/${id}`;

      await putMultipleSizedImages(
        context.env,
        path,
        dataContent,
        imageData,
        context.mediaTransaction
      );

      return { name: '#image', filePath: path, ...imageData };
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
  imageSizeMap: ImageDataMap,
  context: HydrationContext
): Promise<RichTextAtomNode[]> {
  return Promise.all(
    nodes.map((node) => hydrateRichTextBase(node, imageSizeMap, context))
  );
}
