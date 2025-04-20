import { parse } from 'parse5';
import { Document, Element } from 'parse5/dist/tree-adapters/default';

import { Teacher, TeacherPageData, TeachersBlock } from './types';

import { getAttributeValue, isTextNode } from '@/utils/html';

function findBody(document: Document): Element | undefined {
  const html = document.childNodes.find((node) => node.nodeName === 'html') as
    | Element
    | undefined;

  return html?.childNodes.find((node) => node.nodeName === 'body') as
    | Element
    | undefined;
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

export function getPeopleFromTeachersPage(content: string): Teacher[] {
  const page = parse(content);
  const dataScript = getDataScriptContent(page);
  const data = JSON.parse(dataScript) as TeacherPageData;

  const teachersBlock = data.props.pageProps.preparedBlocks.find(
    (block): block is TeachersBlock => block.collection === 'teachers_blocks'
  );

  if (teachersBlock === undefined) {
    throw new Error('Cannot find teachers block');
  }

  return teachersBlock.props.people;
}
