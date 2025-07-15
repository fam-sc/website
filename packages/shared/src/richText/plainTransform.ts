import { RichTextAtomNode, RichTextString } from './types';

function normalizeWhitespaces(text: string): string {
  return text.replaceAll(/\s+/g, ' ').trim();
}

function transformNodeArrayToPlainText(nodes: RichTextAtomNode[]): string {
  return normalizeWhitespaces(
    nodes.map((part) => richTextToPlainText(part)).join(' ')
  );
}

export function richTextToPlainText(text: RichTextString): string {
  if (typeof text === 'string') {
    return normalizeWhitespaces(text);
  }

  if (Array.isArray(text)) {
    return transformNodeArrayToPlainText(text);
  }

  return 'children' in text && text.children
    ? transformNodeArrayToPlainText(text.children)
    : '';
}
