import { RichTextString } from './types';

export function richTextCharacterLength(value: RichTextString): number {
  if (typeof value === 'string') {
    return value.length;
  } else if (Array.isArray(value)) {
    let result = 0;

    for (const item of value) {
      result += richTextCharacterLength(item);
    }

    return result;
  }

  return value.name !== '#image' && value.children
    ? richTextCharacterLength(value.children)
    : 0;
}
