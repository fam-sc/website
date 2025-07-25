// Simple attempt at minifying HTML

import { DefaultTreeAdapterTypes, parse } from 'parse5'; // Simple attempt at minifying HTML

export function minifyInlineCss(text: string): string {
  let result = text
    .split(';')
    .map((part) => {
      const colonIndex = part.indexOf(':');
      if (colonIndex === -1) {
        return '';
      }

      const name = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();

      return `${name}:${value}`;
    })
    .filter((part) => part.length > 0)
    .join(';');

  if (result.length > 0) {
    result += ';';
  }

  return result;
}

function nodeToString(node: DefaultTreeAdapterTypes.Node): string {
  switch (node.nodeName) {
    case '#documentType': {
      return '<!DOCTYPE html>';
    }
    case '#comment': {
      return '';
    }
    case 'template': {
      const children = nodeToString(
        (node as DefaultTreeAdapterTypes.Template).content
      );
      return `<template>${children}</template>`;
    }
    case '#text': {
      return (node as DefaultTreeAdapterTypes.TextNode).value
        .trim()
        .replaceAll('\n', '');
    }
    case '#document': {
      return node.childNodes.map((node) => nodeToString(node)).join('');
    }
    default: {
      const element = node as DefaultTreeAdapterTypes.Element;

      const { nodeName } = element;
      const children = element.childNodes
        .map((node) => nodeToString(node))
        .join('');

      const attrs = element.attrs
        .map(({ name, value }) => {
          const valuePart = name === 'style' ? minifyInlineCss(value) : value;

          return `${name}="${valuePart}"`;
        })
        .join(' ');

      const tag = attrs.length > 0 ? `${nodeName} ${attrs}` : nodeName;

      return children.length === 0
        ? `<${tag}/>`
        : `<${tag}>${children}</${nodeName}>`;
    }
  }
}

export function minifyHTML(input: string): string {
  const node = parse(input);

  return nodeToString(node);
}
