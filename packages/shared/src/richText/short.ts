import { shortenByWord } from '../string/shortenByWord';
import { RichTextAtomNode, RichTextString } from './types';
import { richTextCharacterLength } from './length';
import { Ending } from '../string/ending';

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

  if (value.name === '#image') {
    return '';
  }

  return {
    name: value.name,
    attrs: value.attrs,
    children: value.children
      ? shortenRichText(value.children, limit, ending)
      : undefined,
  };
}
