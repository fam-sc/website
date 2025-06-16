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

  switch (value.name) {
    case '#image':
    case '#placeholder-image':
    case '#unsized-image': {
      return 0;
    }
    default: {
      return value.children ? richTextCharacterLength(value.children) : 0;
    }
  }
}
