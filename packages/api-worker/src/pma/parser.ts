import { parse } from 'parse5';
import { Document, Element } from 'parse5/dist/tree-adapters/default';

import { Block, BlockCollection, PageData } from './types';

import {
  findChildByNodeName,
  getAttributeValue,
  isTextNode,
} from '@shared/html';

function findBody(document: Document): Element | undefined {
  const html = findChildByNodeName(document, 'html');

  return findChildByNodeName(html, 'body');
}

function getDataScriptContent(document: Document): string {
  const body = findBody(document);
  if (body === undefined) {
    throw new Error('Unexpected content: no body');
  }

  for (const node of body.childNodes) {
    if (node.nodeName === 'script') {
      const id = getAttributeValue(node.attrs, 'id');
      const type = getAttributeValue(node.attrs, 'type');

      if (id === '__NEXT_DATA__' && type === 'application/json') {
        const [firstNode] = node.childNodes;

        if (isTextNode(firstNode)) {
          return firstNode.value;
        } else {
          throw new Error(
            'Unexpected content: __NEXT_DATA__ script is not text inside'
          );
        }
      }
    }
  }

  throw new Error('Cannot find __NEXT_DATA__ script');
}

export function getNextData(pageContent: string): PageData {
  const page = parse(pageContent);
  const dataScript = getDataScriptContent(page);

  return JSON.parse(dataScript) as PageData;
}

export function findNextDataBlock<C extends BlockCollection>(
  pageContent: string,
  collection: C
): Block<C> {
  const data = getNextData(pageContent);

  const result = data.props.pageProps.preparedBlocks.find(
    (block) => block.collection === collection
  ) as Block<C> | undefined;

  if (result === undefined) {
    throw new Error(`Cannot find ${collection} block`);
  }

  return result;
}
