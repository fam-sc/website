export type RichTextPlainNode = string;

export const supportedRichTextTags = [
  'p',
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'u',
  's',
  'b',
  'em',
  'strong',
  'br',
  'hr',
  'pre',
  'sub',
  'sup',
  'blockquote',
  'iframe',
  'div',
  'img',
  'li',
  'ul',
  'ol',
  'span',
  'td',
  'tr',
  'th',
  'tbody',
  'thead',
  'table',
] as const;

export type RichTextNodeName = (typeof supportedRichTextTags)[number];

export interface RichTextElementNode {
  name: RichTextNodeName;
  attrs?: Record<string, unknown>;
  children?: RichTextAtomNode[];
}

export interface RichTextImageNode {
  name: '#image';
  filePath: string;
  width: number;
  height: number;
}

export type RichTextAtomNode =
  | RichTextPlainNode
  | RichTextElementNode
  | RichTextImageNode;

export type RichTextNode = RichTextAtomNode | RichTextAtomNode[];
export type RichTextString = RichTextNode;
