import { Token, TokensList } from 'marked';

import { MarkdownConfig } from './config';

type KeySet = Set<keyof MarkdownConfig>;

export type ConfigUsage = {
  keys: (keyof MarkdownConfig)[];
  usesFragment: boolean;
};

type ElementMap = Record<string, keyof MarkdownConfig | undefined>;

const elements: ElementMap = {
  list_item: 'listItem',
  paragraph: 'paragraph',
  link: 'anchor',
  heading: 'header',
};

function populateTokenConfigUsage(token: Token, output: KeySet) {
  const elementType = elements[token.type];
  if (elementType !== undefined) {
    output.add(elementType);
  }

  if ('tokens' in token && token.tokens) {
    populateTokenArrayConfigUsage(token.tokens, output);
  }

  if ('items' in token) {
    populateTokenArrayConfigUsage(token.items as Token[], output);
  }
}

function populateTokenArrayConfigUsage(tokens: Token[], output: KeySet) {
  for (const child of tokens) {
    populateTokenConfigUsage(child, output);
  }
}

export function getTokenArrayConfigUsage(tokens: TokensList): ConfigUsage {
  const keys = new Set<keyof MarkdownConfig>();

  populateTokenArrayConfigUsage(tokens, keys);

  return { keys: [...keys], usesFragment: tokens.length > 1 };
}
