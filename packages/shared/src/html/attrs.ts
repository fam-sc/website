import { DefaultTreeAdapterTypes } from 'parse5';

type Node = DefaultTreeAdapterTypes.Node;

export function getAttributeValue(
  node: Extract<Node, { attrs: unknown }>,
  name: string
): string | undefined {
  return node.attrs.find((attr) => attr.name === name)?.value;
}
