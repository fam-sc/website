import { defaultTreeAdapter, DefaultTreeAdapterTypes } from 'parse5';

import { getAttributeValue } from '../html';
import { RichTextNode, supportedRichTextTags } from './types';

type Node = DefaultTreeAdapterTypes.Node;
type TextNode = DefaultTreeAdapterTypes.TextNode;

type ParseResult = {
  value: RichTextNode;
  imageUrls: string[];
};

type ParseContext = {
  imageUrls: string[];
};

function workerArray(nodes: Node[], context: ParseContext) {
  return nodes.flatMap((childNode) => worker(childNode, context));
}

function worker(node: Node, context: ParseContext): RichTextNode {
  switch (node.nodeName) {
    case '#document-fragment': {
      return workerArray(node.childNodes, context);
    }
    case '#text': {
      return (node as TextNode).value;
    }
    case 'img': {
      const src = getAttributeValue(node, 'src');
      if (src === undefined) {
        throw new Error('Image has no source');
      }

      const id = context.imageUrls.length;
      context.imageUrls.push(src);

      return { name: '#placeholder-image', id };
    }
    default: {
      const { nodeName } = node;
      if (defaultTreeAdapter.isElementNode(node)) {
        if (!supportedRichTextTags.includes(nodeName)) {
          throw new Error(`Unsupported tag: ${nodeName}`);
        }

        const attrEntries = node.attrs.map(({ name, value }) => [name, value]);
        const attrs =
          attrEntries.length > 0 ? Object.fromEntries(attrEntries) : undefined;

        const children = workerArray(node.childNodes, context);

        return {
          name: nodeName,
          attrs,
          children: children.length > 0 ? children : undefined,
        };
      }

      throw new Error(`Unknown node: ${nodeName}`);
    }
  }
}

function normalizeArray(node: RichTextNode): RichTextNode {
  if (Array.isArray(node) && node.length === 1) {
    return node[0];
  }

  return node;
}

export function parseHtmlToRichText(node: Node | Node[]): ParseResult {
  const imageUrls: string[] = [];
  const context: ParseContext = { imageUrls };
  const value = Array.isArray(node)
    ? workerArray(node, context)
    : worker(node, context);

  return { value: normalizeArray(value), imageUrls };
}
