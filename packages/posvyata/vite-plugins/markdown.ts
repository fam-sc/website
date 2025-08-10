import fsp from 'node:fs/promises';

import { lexer, Token } from 'marked';
import { Plugin } from 'vite';

import {
  RawMarkdownAtomNode,
  RawMarkdownNodeType,
} from '../src/utils/markdown/types';

const EXTENSION = '.md?raw';

function tokenArrayToNodes(tokens: Token[]): RawMarkdownAtomNode[] {
  return tokens.flatMap((token) => tokenToNode(token));
}

function resolveRawText(text: string): string | RawMarkdownAtomNode[] {
  const nodes: RawMarkdownAtomNode[] = [];
  let lastOffset = 0;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const newLineIndex = text.indexOf('\n', lastOffset);
    if (newLineIndex === -1) {
      break;
    }

    const part = text.slice(lastOffset, newLineIndex);
    if (part.length > 0) {
      nodes.push(part);
    }

    nodes.push({
      type: RawMarkdownNodeType.BREAK_LINE,
    });

    lastOffset = newLineIndex + 1;
  }

  if (lastOffset < text.length) {
    nodes.push(text.slice(lastOffset));
  }

  return nodes.length === 0 ? text : nodes;
}

function isSingleTextToken({ tokens }: Extract<Token, { tokens?: Token[] }>) {
  return tokens && tokens.length > 0 && tokens[0].type === 'text';
}

function resolveChildren(token: Extract<Token, { tokens?: Token[] }>) {
  return token.tokens === undefined || isSingleTextToken(token)
    ? [resolveRawText(token.raw)].flat()
    : tokenArrayToNodes(token.tokens);
}

function tokenToNode(token: Token): RawMarkdownAtomNode[] {
  switch (token.type) {
    case 'text': {
      return resolveChildren(token);
    }
    case 'paragraph': {
      return [
        ...resolveChildren(token),
        { type: RawMarkdownNodeType.BREAK_LINE },
      ];
    }
    case 'em': {
      return [
        { type: RawMarkdownNodeType.ITALIC, children: resolveChildren(token) },
      ];
    }
    case 'strong': {
      return [
        { type: RawMarkdownNodeType.BOLD, children: resolveChildren(token) },
      ];
    }
    case 'heading': {
      return [
        { type: RawMarkdownNodeType.HEADER, children: resolveChildren(token) },
      ];
    }
    case 'space': {
      return [{ type: RawMarkdownNodeType.BREAK_LINE }];
    }
    default: {
      throw new Error(`Unknown node: ${token.type}`);
    }
  }
}

function transformMarkdownToModule(content: string): string {
  const nodeList = lexer(content);

  const nodes = tokenArrayToNodes(nodeList);

  console.log(JSON.stringify(nodes, undefined, 2));

  return `const _default = ${JSON.stringify(nodes)}; export default _default;`;
}

export function rawMarkdownPlugin(): Plugin {
  return {
    name: 'raw-markdown',
    enforce: 'pre',
    async transform(source, id) {
      if (id.endsWith(EXTENSION)) {
        console.log(id);
        const content = await fsp.readFile(id.slice(0, -4), 'utf8');

        return transformMarkdownToModule(content);
      }
    },
  };
}
