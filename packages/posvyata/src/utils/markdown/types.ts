export const enum RawMarkdownNodeType {
  HEADER = 0,
  ITALIC = 1,
  BOLD = 2,
  BREAK_LINE = 3,
}

export type RawMarkdownAtomNode =
  | string
  | {
      type: RawMarkdownNodeType.BREAK_LINE;
    }
  | {
      type: RawMarkdownNodeType;
      children: RawMarkdownAtomNode[];
    };

export type RawMarkdownNode = RawMarkdownAtomNode | RawMarkdownAtomNode[];

export type RawMarkdownString = RawMarkdownNode;
