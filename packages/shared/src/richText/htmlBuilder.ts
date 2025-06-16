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

  switch (node.name) {
    case '#image': {
      const { filePath, sizes } = node;
      const lastSize = sizes.at(-1);

      const src = `${options.mediaUrl}/${filePath}`;
      const srcset = sizes
        .map(({ width }) => `${src}/${width} ${width}w`)
        .join(',');

      return lastSize
        ? `<img src="${src}/${lastSize.width}" srcset="${srcset}" width="${lastSize.width}" height="${lastSize.height}"/>`
        : `<img src="${src}"/>`;
    }
    case '#placeholder-image':
    case '#unsized-image': {
      throw new Error(`Unexpected node type: ${node.name}`);
    }
    default: {
      const { name, attrs, children } = node;

      const tag = attrs ? `${name} ${attributesToString(attrs)}` : name;

      return children !== undefined && children.length > 0
        ? `<${tag}>${richTextToHtml(children, options)}</${name}>`
        : `<${tag}/>`;
    }
  }
}

export function richTextToHtml(
  richText: RichTextNode,
  options: HtmlBuilderOptions
): string {
  return Array.isArray(richText)
    ? richText.map((node) => atomNode(node, options)).join('')
    : atomNode(richText, options);
}
