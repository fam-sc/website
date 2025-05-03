import { shortenByWord } from '@/utils/shortenByWord';
import { RichTextAtomNode, RichTextString } from './types';
import { richTextCharacterLength } from './length';

export function shortenRichText(
  value: RichTextAtomNode,
  limit: number
): RichTextAtomNode;

export function shortenRichText(
  value: RichTextAtomNode[],
  limit: number
): RichTextAtomNode[];

export function shortenRichText(
  value: RichTextString,
  limit: number
): RichTextString;

export function shortenRichText(
  value: RichTextString,
  limit: number
): RichTextString {
  if (typeof value === 'string') {
    return shortenByWord(value, limit);
  } else if (Array.isArray(value)) {
    let currentLength = 0;
    const result: RichTextAtomNode[] = [];

    for (const element of value) {
      const elementLength = richTextCharacterLength(element);

      if (currentLength + elementLength > limit) {
        result.push(shortenRichText(element, limit - currentLength));
        break;
      }

      currentLength += elementLength;
      result.push(element);
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
      ? shortenRichText(value.children, limit)
      : undefined,
  };
}
