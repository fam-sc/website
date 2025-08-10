import { Token } from 'marked';
import { JSX } from 'react';

import { MarkdownConfig } from './config';

type TagType = keyof JSX.IntrinsicElements;
type ConfigType = keyof MarkdownConfig;

type ElementMap = Record<string, [TagType] | [TagType, ConfigType] | undefined>;

const elements: ElementMap = {
  list_item: ['li', 'listItem'],
  paragraph: ['p', 'paragraph'],
  br: ['br'],
  hr: ['hr'],
  strong: ['strong'],
};

function escapeString(text: string): string {
  return text.replaceAll("'", String.raw`\'`);
}

function createElement(
  tag: string,
  props: [string, string][],
  children: string[]
) {
  const childrenProp =
    children.length > 0 ? ['children', `[${children.join(',')}]`] : null;

  const commaProps = [...props, ...(childrenProp ? [childrenProp] : [])]
    .map(([key, value]) => `${key}:${value}`)
    .join(',');

  const jsxProps = commaProps.length === 0 ? 'null' : `{${commaProps}}`;

  return `_jsx(${tag},${jsxProps})`;
}

function renderNoPropsElement(
  token: Token & { tokens?: Token[] },
  tag: string
): string {
  return createElement(tag, [], renderTokenArray(token.tokens));
}

export function renderTokenArray(
  tokens: Token[] | undefined,
  mode: 'enum' | 'fragment' = 'enum'
): string[] {
  if (tokens === undefined) {
    return [];
  } else if (tokens.length === 1) {
    const result = renderToken(tokens[0]);

    return Array.isArray(result) ? result : [result];
  } else {
    const parts = tokens.flatMap((token) => renderToken(token));

    return mode === 'fragment' ? [createElement('Fragment', [], parts)] : parts;
  }
}

export function renderToken(token: Token): string | string[] {
  switch (token.type) {
    case 'text': {
      if (token.tokens === undefined) {
        const text = escapeString((token.text as string).replaceAll('\n', ' '));

        return `'${text}'`;
      } else {
        return renderTokenArray(token.tokens);
      }
    }
    case 'heading': {
      const { depth } = token;

      const children = renderTokenArray(token.tokens);

      return createElement(
        'header',
        [['level', (depth as number).toString()]],
        children
      );
    }
    case 'link': {
      const href = escapeString(token.href as string);

      return createElement(
        'anchor',
        [['href', `'${href}'`]],
        renderTokenArray(token.tokens)
      );
    }
    case 'list': {
      return createElement(
        token.ordered ? `'ol'` : `'ul'`,
        [],
        renderTokenArray(token.items as Token[])
      );
    }
    case 'space': {
      return [];
    }
  }

  const elementInfo = elements[token.type];
  if (elementInfo !== undefined) {
    const [htmlTag, configTag] = elementInfo;
    const tag = configTag ?? htmlTag;

    return renderNoPropsElement(token, tag);
  }

  throw new Error(`Unexpected token: ${token.type}`);
}
