// Simple attempt at minifying HTML

import { parse } from 'parse5';
import { Element, Node, Template, TextNode } from './types';

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

function nodeToString(node: Node): string {
  switch (node.nodeName) {
    case '#documentType': {
      return '<!DOCTYPE html>';
    }
    case '#comment': {
      return '';
    }
    case 'template': {
      const children = nodeToString((node as Template).content);
      return `<template>${children}</template>`;
    }
    case '#text': {
      return (node as TextNode).value.trim().replaceAll('\n', '');
    }
    case '#document': {
      return node.childNodes.map((node) => nodeToString(node)).join('');
    }
    default: {
      const element = node as Element;

      const { nodeName } = element;
      const children = element.childNodes
        .map((node) => nodeToString(node))
        .join('');

      let attrs = element.attrs
        .map(({ name, value }) => {
          if (name === 'style') {
            return `${name}="${minifyInlineCss(value)}"`;
          }

          return `${name}="${value}"`;
        })
        .join(' ');

      if (attrs.length > 0) {
        attrs = ` ${attrs}`;
      }

      return children.length === 0
        ? `<${nodeName}${attrs}/>`
        : `<${nodeName}${attrs}>${children}</${nodeName}>`;
    }
  }
}

export function minifyHTML(input: string): string {
  const node = parse(input);

  return nodeToString(node);
}
