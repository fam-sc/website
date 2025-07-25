import { Ending } from '../string/ending';
import { shortenByWord } from '../string/shortenByWord';
import { richTextCharacterLength } from './length.js';
import { RichTextAtomNode, RichTextString } from './types.js';

export function shortenRichText(
  value: RichTextAtomNode,
  limit: number,
  ending?: Ending
): RichTextAtomNode;

export function shortenRichText(
  value: RichTextAtomNode[],
  limit: number,
  ending?: Ending
): RichTextAtomNode[];

export function shortenRichText(
  value: RichTextString,
  limit: number,
  ending?: Ending
): RichTextString;

export function shortenRichText(
  value: RichTextString,
  limit: number,
  ending?: Ending
): RichTextString {
  if (typeof value === 'string') {
    return shortenByWord(value, limit, ending);
  } else if (Array.isArray(value)) {
    let currentLength = 0;
    const result: RichTextAtomNode[] = [];

    for (const element of value) {
      const elementLength = richTextCharacterLength(element);

      if (currentLength + elementLength > limit) {
        result.push(shortenRichText(element, limit - currentLength, ending));
        break;
      }

      currentLength += elementLength;

      if (!(typeof element === 'object' && element.name === '#image')) {
        result.push(element);
      }
    }

    return result;
  }

  const { name } = value;
  switch (name) {
    case '#image':
    case '#placeholder-image':
    case '#unsized-image': {
      return '';
    }
    default: {
      return {
        name,
        attrs: value.attrs,
        children: value.children
          ? shortenRichText(value.children, limit, ending)
          : undefined,
      };
    }
  }
}
