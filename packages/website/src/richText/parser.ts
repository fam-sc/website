import { parseFragment, serializeOuter } from 'parse5';
import type {
  ChildNode,
  DocumentFragment,
  Element,
} from 'parse5/dist/tree-adapters/default';

import { transformArrayAttributesToRichText } from './attributes';
import { createRichTextNode } from './factory';
import {
  RichTextAtomNode,
  RichTextNode,
  RichTextString,
  supportedRichTextTags,
} from './types';

import { getAttributeValue, HtmlNodeWithName } from '@/utils/html';
import { linkIterator } from '@/utils/linkIterator';
import { normalizeToRelative } from '@/utils/url';

type SurroundingContext = {
  insideAnchor: boolean;
};

type NodeOrFragment = ChildNode | DocumentFragment;

type NodeTransformer<T extends NodeOrFragment = NodeOrFragment> = (
  element: T,
  surroundingContext: SurroundingContext
) => RichTextNode | undefined;

type TransformerMap<K extends string = string> = {
  [T in K]: NodeTransformer<HtmlNodeWithName<T>> | undefined;
};

function createHandlerMap<K extends string>(
  map: TransformerMap<K>
): TransformerMap {
  return map as TransformerMap;
}

function flattenRootNode(node: RichTextNode): RichTextNode {
  if (Array.isArray(node) && node.length === 1) {
    return node[0];
  }

  return node;
}

function transformChildNodes(
  nodes: ChildNode[],
  surroundingContext: SurroundingContext
): RichTextAtomNode[] {
  const result = nodes.flatMap((node) =>
    transformNode(node, surroundingContext)
  );

  return result.filter(
    (child): child is RichTextAtomNode =>
      child !== undefined && child !== '' && child !== '\n'
  );
}

function transformNode(
  node: NodeOrFragment,
  surroundingContext: SurroundingContext
): RichTextNode | undefined {
  const handler = handlerMap[node.nodeName] ?? defaultHandler;

  return handler(node as Element, surroundingContext);
}

const handlerMap = createHandlerMap({
  '#text': (element, { insideAnchor }) => {
    // Don't try to find links inside a link.
    if (!insideAnchor) {
      // Find links and replace them with HTML anchors.
      const elements: RichTextNode = [];

      for (const part of linkIterator(element.value)) {
        if (typeof part === 'string') {
          elements.push(part);
        } else {
          elements.push({
            name: 'a',
            attrs: { href: normalizeToRelative(part.href) },
            children: [part.text],
          });
        }
      }

      return elements;
    }

    return element.value;
  },
  a: ({ attrs, childNodes }) => {
    let href = getAttributeValue(attrs, 'href');
    const parsedAttributes = transformArrayAttributesToRichText(attrs);
    const children = transformChildNodes(childNodes, {
      insideAnchor: true,
    });

    if (href !== undefined) {
      href = normalizeToRelative(href);

      return {
        name: 'a',
        attrs: { ...parsedAttributes, href },
        children,
      };
    }

    return {
      name: 'a',
      attrs: parsedAttributes,
      children,
    };
  },
  div: ({ attrs, childNodes }, surroundingContext) => {
    // Based on the assumption that div without style
    // should not be in the markup at all.

    const styleAttribute = attrs.find(({ name }) => name === 'style');
    if (styleAttribute === undefined) {
      return transformChildNodes(childNodes, surroundingContext);
    }

    return createRichTextNode({
      name: 'div',
      attrs: transformArrayAttributesToRichText(attrs),
      children: transformChildNodes(childNodes, surroundingContext),
    });
  },
  '#document-fragment': (element, surroundingContext) => {
    return transformChildNodes(element.childNodes, surroundingContext);
  },
  // eslint-disable-next-line unicorn/no-useless-undefined
  '#comment': () => undefined,
});

const defaultHandler: NodeTransformer<Element> = (
  element,
  surroundingContext
) => {
  const { nodeName, childNodes, attrs } = element;
  if (!supportedRichTextTags.includes(nodeName)) {
    throw new Error(`Unsupported tag: ${serializeOuter(element)}`);
  }

  return createRichTextNode({
    name: nodeName,
    attrs: transformArrayAttributesToRichText(attrs),
    children: transformChildNodes(childNodes, surroundingContext),
  });
};

export function parseHtmlToRichText(input: string): RichTextString {
  const fragment = parseFragment(input);
  const result = transformNode(fragment, {
    insideAnchor: false,
  });
  if (result === undefined) {
    throw new Error('Root node cannot be undefined');
  }

  return flattenRootNode(result);
}
