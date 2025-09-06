import { ImageData } from '@sc-fam/data';
import { getRichTextChildren, RichTextString } from '@sc-fam/shared/richText';

export type ImageDataMap = Record<string, ImageData | undefined>;

function populateImageSizeMapFromNode(
  node: RichTextString,
  output: ImageDataMap
) {
  if (typeof node === 'object' && 'name' in node && node.name === '#image') {
    output[node.filePath] = { format: node.format, sizes: node.sizes };
  }

  for (const child of getRichTextChildren(node)) {
    populateImageSizeMapFromNode(child, output);
  }
}

export function getImageSizeMap(text: RichTextString): ImageDataMap {
  const result: ImageDataMap = {};
  populateImageSizeMapFromNode(text, result);

  return result;
}
