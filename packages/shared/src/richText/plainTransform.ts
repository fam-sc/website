import { RichTextAtomNode, RichTextString } from './types.js';
import { getRichTextChildren } from './utils.js';

function normalizeWhitespaces(text: string): string {
  return text.replaceAll(/\s+/g, ' ').trim();
}

function nodeArrayToPlainText(nodes: RichTextAtomNode[]): string {
  return nodes.map((part) => worker(part)).join(' ');
}

function worker(text: RichTextString): string {
  if (typeof text === 'string') {
    return text;
  }

  const children = getRichTextChildren(text);

  return children.length > 0 ? nodeArrayToPlainText(children) : '';
}

export function richTextToPlainText(text: RichTextString): string {
  return normalizeWhitespaces(worker(text));
}
