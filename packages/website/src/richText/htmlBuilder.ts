import { RichTextAtomNode, RichTextNode } from './types';

import { getMediaFileUrl } from '@/api/media';

function attributesToString(attrs: Record<string, unknown>): string {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
}

function atomNode(node: RichTextAtomNode) {
  if (typeof node === 'string') {
    return node;
  }

  if (node.name === '#image') {
    return `<img src="${getMediaFileUrl(node.filePath)}" width="${node.width}" height="${node.height}"/>`;
  }

  const { name, attrs, children } = node;

  const attrString = attrs ? ` ${attributesToString(attrs)}` : '';

  return children !== undefined && children.length > 0
    ? `<${name}${attrString}>${richTextToHtml(children)}</${name}>`
    : `<${name}${attrString}/>`;
}

export function richTextToHtml(richText: RichTextNode): string {
  return Array.isArray(richText)
    ? richText.map((node) => atomNode(node)).join('')
    : atomNode(richText);
}
