import { Attribute } from 'parse5/dist/common/token';
import {
  ChildNode,
  CommentNode,
  DocumentFragment,
  Element,
  Node,
  Template,
  TextNode,
} from 'parse5/dist/tree-adapters/default';

type SpecialNodeMap = {
  '#text': TextNode;
  '#document-fragment': DocumentFragment;
  template: Template;
  '#comment': CommentNode;
};

export type HtmlNodeWithName<T extends string> = T extends keyof SpecialNodeMap
  ? SpecialNodeMap[T]
  : Element;

export function isTextNode(node: Node): node is TextNode {
  return node.nodeName === '#text';
}

export function transformArrayAttributesToObject(
  attributes: Attribute[]
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const { name, value } of attributes) {
    result[name] = value;
  }

  return result;
}

export function findAttributeByName(
  attributes: Attribute[],
  target: string
): Attribute | undefined {
  return attributes.find(({ name }) => name === target);
}

export function getAttributeValue(
  attributes: Attribute[],
  target: string
): string | undefined {
  return findAttributeByName(attributes, target)?.value;
}

export function getAttributeNumberValue(
  attributes: Attribute[],
  target: string
): number | undefined {
  const string = getAttributeValue(attributes, target);

  return string === undefined ? undefined : Number.parseInt(string);
}

export function findChildByNodeName(
  parent: { childNodes: ChildNode[] } | undefined,
  name: string
) {
  return parent?.childNodes.find((node) => node.nodeName === name) as
    | Element
    | undefined;
}
