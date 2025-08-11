import { DefaultTreeAdapterTypes } from 'parse5';

import { getAttributeValue } from './attrs.js';

type Node = DefaultTreeAdapterTypes.Node;
type Element = DefaultTreeAdapterTypes.Element;

function matchClass(value: string, part: string): boolean {
  const parts = value.split(' ');

  return parts.includes(part);
}

function matchNode(node: Node, selector: string): node is Element {
  if ('attrs' in node) {
    const { nodeName } = node;
    const hashIndex = selector.indexOf('#');
    if (hashIndex !== -1) {
      const name = selector.slice(0, hashIndex);
      const id = selector.slice(hashIndex + 1);

      const nodeId = getAttributeValue(node, 'id');

      if (name == nodeName && id === nodeId) {
        return true;
      }
    }

    const dotIndex = selector.indexOf('.');
    if (dotIndex !== -1) {
      const name = selector.slice(0, dotIndex);
      const className = selector.slice(dotIndex + 1);

      const nodeClass = getAttributeValue(node, 'class');

      if (
        name === nodeName &&
        nodeClass !== undefined &&
        matchClass(nodeClass, className)
      ) {
        return true;
      }
    }

    return nodeName === selector;
  }

  return false;
}

export function selectFirstNode(
  node: Node,
  selector: string
): Element | undefined {
  if (matchNode(node, selector)) {
    return node;
  }

  if ('childNodes' in node) {
    for (const childNode of node.childNodes) {
      const result = selectFirstNode(childNode, selector);

      if (result !== undefined) {
        return result;
      }
    }
  }

  return undefined;
}
