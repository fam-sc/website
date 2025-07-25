import { ImageSize } from '@sc-fam/shared/image';
import { RichTextString } from '@sc-fam/shared/richText';

export type ImageSizeMap = Record<string, ImageSize[] | undefined>;

function populateImageSizeMapFromNode(
  node: RichTextString,
  output: ImageSizeMap
) {
  if (typeof node === 'object') {
    if (Array.isArray(node)) {
      for (const child of node) {
        populateImageSizeMapFromNode(child, output);
      }
    } else if (node.name === '#image') {
      output[node.filePath] = node.sizes;
    } else if ('children' in node && node.children) {
      for (const child of node.children) {
        populateImageSizeMapFromNode(child, output);
      }
    }
  }
}

export function getImageSizeMap(text: RichTextString): ImageSizeMap {
  const result: ImageSizeMap = {};
  populateImageSizeMapFromNode(text, result);

  return result;
}
