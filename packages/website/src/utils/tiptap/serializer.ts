import {
  FilePath,
  RichTextAtomNode,
  RichTextElementNode,
  RichTextString,
  supportedRichTextTags,
} from '@sc-fam/shared/richText';
import { DOMSerializer, Fragment, Schema } from '@tiptap/pm/model';

import { getMediaBaseUrl } from '@/api/media';

type MaybeArray<T> = T | T[];

export type SerializeContext = {
  // Maps object urls to files backing them.
  files: Readonly<Record<string, File | undefined>>;
};

export type SerializeInternalContext = {
  lastFileId: number;
  files: File[];
};

export type SerializeResultWithFiles<T = RichTextString> = {
  value: T;

  // Maps placeholder ids to files
  files: File[];
};

export function tiptapTextToRichText(
  fragment: Fragment,
  schema: Schema,
  context: SerializeContext
): SerializeResultWithFiles {
  const documentFragment =
    DOMSerializer.fromSchema(schema).serializeFragment(fragment);

  const files: File[] = [];
  const internalContext: SerializeInternalContext = { lastFileId: 0, files };
  const result = htmlNodeToRichTextNode(
    documentFragment,
    context,
    internalContext
  );

  return result !== undefined
    ? { value: result, files }
    : { value: [], files: [] };
}

function getElementAttributes({
  attributes,
}: Element): Record<string, string> | undefined {
  if (attributes.length === 0) {
    return undefined;
  }

  const result: Record<string, string> = {};

  for (const attr of attributes) {
    result[attr.name] = attr.value;
  }

  return result;
}

export function htmlNodeToRichTextNode(
  node: Node,
  context: SerializeContext,
  internalContext: SerializeInternalContext
): MaybeArray<RichTextAtomNode> | undefined {
  switch (node.nodeType) {
    case Node.TEXT_NODE: {
      return (node as Text).data;
    }
    case Node.ELEMENT_NODE: {
      const element = node as Element;

      const name = element.nodeName.toLowerCase();
      if (name === 'img') {
        return htmlImageToRichTextNode(
          element as HTMLImageElement,
          context,
          internalContext
        );
      }

      if (!supportedRichTextTags.includes(name)) {
        throw new Error('Unsupported element type');
      }

      const attrs = getElementAttributes(element);
      const children = childNodesToRichTextNodes(
        element.childNodes,
        context,
        internalContext
      );

      const result: RichTextElementNode = { name, children };
      if (attrs !== undefined) {
        result.attrs = attrs;
      }

      return result;
    }
    case Node.DOCUMENT_FRAGMENT_NODE: {
      const { childNodes } = node as DocumentFragment;
      const result = childNodesToRichTextNodes(
        childNodes,
        context,
        internalContext
      );

      if (result.length === 1) {
        return result[0];
      }

      return result;
    }
    case Node.COMMENT_NODE: {
      return undefined;
    }
    default: {
      throw new Error(`Unexpected node type: ${node.nodeType}`);
    }
  }
}

function childNodesToRichTextNodes(
  nodes: NodeListOf<ChildNode>,
  context: SerializeContext,
  internalContext: SerializeInternalContext
): RichTextAtomNode[] {
  const result: RichTextAtomNode[] = [];

  for (const node of nodes) {
    const nodes = htmlNodeToRichTextNode(node, context, internalContext);

    if (nodes !== undefined) {
      if (Array.isArray(nodes)) {
        result.push(...nodes);
      } else {
        result.push(nodes);
      }
    }
  }

  return result;
}

function htmlImageToRichTextNode(
  image: HTMLImageElement,
  context: SerializeContext,
  internalContext: SerializeInternalContext
): RichTextAtomNode {
  const baseUrl = getMediaBaseUrl();

  const { src } = image;
  if (src.startsWith(baseUrl)) {
    return {
      name: '#unsized-image',
      filePath: src.slice(baseUrl.length + 1) as FilePath,
    };
  } else {
    const file = context.files[src];
    if (file === undefined) {
      throw new Error('Cannot find a file by id');
    }

    const id = internalContext.lastFileId++;
    internalContext.files.push(file);

    return { name: '#placeholder-image', id };
  }
}
