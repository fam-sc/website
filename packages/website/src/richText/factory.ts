import { RichTextNode, RichTextNodeName } from './types';

export function createRichTextNode<
  T extends {
    name: RichTextNodeName;
    attrs?: Record<string, unknown>;
    children?: RichTextNode[];
  },
>(value: T): T {
  const { attrs, children } = value;

  const result = { ...value };
  if (attrs !== undefined && Object.keys(attrs).length === 0) {
    delete result['attrs'];
  }

  if (children !== undefined && children.length === 0) {
    delete result['children'];
  }

  return result;
}
