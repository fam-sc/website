import { ImageSize } from '@sc-fam/shared/image';
import { getRichTextChildren, RichTextString } from '@sc-fam/shared/richText';

export type ImageSizeMap = Record<string, ImageSize[] | undefined>;

function populateImageSizeMapFromNode(
  node: RichTextString,
  output: ImageSizeMap
) {
  if (typeof node === 'object' && 'name' in node && node.name === '#image') {
    output[node.filePath] = node.sizes;
  }

  for (const child of getRichTextChildren(node)) {
    populateImageSizeMapFromNode(child, output);
  }
}

export function getImageSizeMap(text: RichTextString): ImageSizeMap {
  const result: ImageSizeMap = {};
  populateImageSizeMapFromNode(text, result);

  return result;
}
