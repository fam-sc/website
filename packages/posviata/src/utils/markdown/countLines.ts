import {
  RawMarkdownAtomNode,
  RawMarkdownNode,
  RawMarkdownNodeType,
} from './types';

function countLinesArray(nodes: RawMarkdownAtomNode[]): number {
  let result = 0;

  for (const element of nodes) {
    result += countLinesWorker(element);
  }

  return result;
}

function countLinesWorker(node: RawMarkdownNode): number {
  if (typeof node !== 'string') {
    if (Array.isArray(node)) {
      return countLinesArray(node);
    }

    if (node.type === RawMarkdownNodeType.BREAK_LINE) {
      return 1;
    }

    return countLinesArray(node.children);
  }

  return 0;
}

export function countLines(node: RawMarkdownNode): number {
  return 1 + countLinesWorker(node);
}
