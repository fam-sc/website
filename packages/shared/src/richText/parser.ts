import { parseFragment, serializeOuter } from 'parse5';
import type { ChildNode, DocumentFragment, Element } from '../html/types';

import { transformArrayAttributesToRichText } from './attributes';
import { createRichTextNode } from './factory';
import {
  RichTextAtomNode,
  RichTextNode,
  RichTextString,
  supportedRichTextTags,
} from './types';

import {
  getAttributeNumberValue,
  getAttributeValue,
  HtmlNodeWithName,
} from '../html';
import { normalizeToRelative } from '../url';

type ImageInfo = {
  filePath: string;
  width: number;
  height: number;
};

export interface ParserContext {
  parseImageToPath(dataUrl: string): Promise<ImageInfo>;
}

type NodeOrFragment = ChildNode | DocumentFragment;

type NodeTransformer<T extends NodeOrFragment = NodeOrFragment> = (
  element: T,
  context: ParserContext
) => Promise<RichTextNode | undefined>;

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

async function transformChildNodes(
  nodes: ChildNode[],
  context: ParserContext
): Promise<RichTextAtomNode[]> {
  const result = await Promise.all(
    nodes.flatMap((node) => transformNode(node, context))
  );

  return result.filter(
    (child): child is RichTextAtomNode =>
      child !== undefined && child !== '' && child !== '\n'
  );
}

function transformNode(
  node: NodeOrFragment,
  context: ParserContext
): Promise<RichTextNode | undefined> {
  const handler = handlerMap[node.nodeName] ?? defaultHandler;

  return handler(node as Element, context);
}

const handlerMap = createHandlerMap({
  img: async ({ attrs }, context) => {
    const src = getAttributeValue(attrs, 'src');
    if (src === undefined) {
      throw new Error('Invalid image');
    }

    let info: ImageInfo;

    if (src.startsWith('data:')) {
      info = await context.parseImageToPath(src);
    } else {
      const url = new URL(src);

      const width = getAttributeNumberValue(attrs, 'width');
      const height = getAttributeNumberValue(attrs, 'height');

      if (width === undefined || height === undefined) {
        throw new Error('No width or height in image');
      }

      // Trim first slash.
      const filePath = url.pathname.slice(1);

      info = { filePath, width, height };
    }

    return { name: '#image', ...info };
  },
  a: async ({ attrs, childNodes }, context) => {
    let href = getAttributeValue(attrs, 'href');
    const parsedAttributes = transformArrayAttributesToRichText(attrs);
    const children = await transformChildNodes(childNodes, context);

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
  '#document-fragment': (element, context) => {
    return transformChildNodes(element.childNodes, context);
  },
  '#text': (element) => Promise.resolve(element.value),

  '#comment': () => Promise.resolve(undefined),
});

const defaultHandler: NodeTransformer<Element> = async (element, context) => {
  const { nodeName, childNodes, attrs } = element;
  if (!supportedRichTextTags.includes(nodeName)) {
    throw new Error(`Unsupported tag: ${serializeOuter(element)}`);
  }

  return createRichTextNode({
    name: nodeName,
    attrs: transformArrayAttributesToRichText(attrs),
    children: await transformChildNodes(childNodes, context),
  });
};

export async function parseHtmlToRichText(
  input: string,
  context: ParserContext
): Promise<RichTextString> {
  const fragment = parseFragment(input);
  const result = await transformNode(fragment, context);
  if (result === undefined) {
    throw new Error('Root node cannot be undefined');
  }

  return flattenRootNode(result);
}
