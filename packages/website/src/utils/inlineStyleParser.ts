import CSS from 'csstype';

import { capitalizeFirstLetter } from './capitalizeFirstLetter';

function toCamelCase(text: string): string {
  const parts = text.split('-');

  return (
    parts[0] +
    parts
      .slice(1)
      .map((part) => capitalizeFirstLetter(part))
      .join('')
  );
}

export function parseInlineStyle(text: string): CSS.Properties {
  const parts = text.split(';');
  const result: Record<string, string> = {};

  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex !== -1) {
      const name = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();

      if (name.length > 0) {
        result[toCamelCase(name)] = value;
      }
    }
  }

  return result as CSS.Properties;
}
