import React from 'react';
import { Attribute } from '../html/types';

import { parseInlineStyle } from '../inlineStyleParser';

type HtmlAttributeToReactMap = {
  [K in string]: keyof React.AllHTMLAttributes<HTMLElement> | undefined;
};

const map: HtmlAttributeToReactMap = {
  class: 'className',
  cellspacing: 'cellSpacing',
  cellpadding: 'cellPadding',
};

function mapHtmlAttributeToReact(name: string): string {
  return map[name] ?? name;
}

export function transformArrayAttributesToRichText(
  attributes: Attribute[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const { name, value } of attributes) {
    // Classes and ids in rich text have no special meaning - they can be removed.
    if (name === 'class' || name === 'id') {
      continue;
    }

    // React does not permit 'style' as string, so we need to parse it to an object style.
    if (name === 'style') {
      result.style = parseInlineStyle(value);
    } else {
      result[mapHtmlAttributeToReact(name)] = value;
    }
  }

  return result;
}
