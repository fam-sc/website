import { RichTextAtomNode, RichTextNode } from './types';

interface HtmlBuilderOptions {
  mediaUrl: string;
}

function attributesToString(attrs: Record<string, unknown>): string {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
}

function atomNode(node: RichTextAtomNode, options: HtmlBuilderOptions) {
  if (typeof node === 'string') {
    return node;
  }

  if (node.name === '#image') {
    return `<img src="${options.mediaUrl}${node.filePath}}" width="${node.width}" height="${node.height}"/>`;
  }

  const { name, attrs, children } = node;

  const attrString = attrs ? ` ${attributesToString(attrs)}` : '';

  return children !== undefined && children.length > 0
    ? `<${name}${attrString}>${richTextToHtml(children, options)}</${name}>`
    : `<${name}${attrString}/>`;
}

export function richTextToHtml(
  richText: RichTextNode,
  options: HtmlBuilderOptions
): string {
  return Array.isArray(richText)
    ? richText.map((node) => atomNode(node, options)).join('')
    : atomNode(richText, options);
}
