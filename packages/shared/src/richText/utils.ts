import { RichTextAtomNode, RichTextString } from './types';

export function getRichTextChildren(node: RichTextString): RichTextAtomNode[] {
  return Array.isArray(node)
    ? node
    : typeof node === 'object' && 'children' in node
      ? (node.children ?? [])
      : [];
}
