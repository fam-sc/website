import { ImageSize } from '../image/types';

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
  'aside',
  'figure',
  'figcaption',
] as const;

export type RichTextNodeName = (typeof supportedRichTextTags)[number];

export interface RichTextElementNode {
  name: RichTextNodeName;
  attrs?: Record<string, unknown>;
  children?: RichTextAtomNode[];
}

export type FilePath = `rich-text-image/${string}`;

export interface RichTextPlaceholderImageNode {
  name: '#placeholder-image';
  id: number;
}

export interface RichTextUnsizedImageNode {
  name: '#unsized-image';
  filePath: FilePath;
}

export interface RichTextImageNode {
  name: '#image';
  filePath: FilePath;
  sizes: ImageSize[];
}

export type RichTextAtomNode =
  | RichTextPlainNode
  | RichTextPlaceholderImageNode
  | RichTextImageNode
  | RichTextUnsizedImageNode
  | RichTextElementNode;

export type RichTextNode = RichTextAtomNode | RichTextAtomNode[];
export type RichTextString = RichTextNode;
