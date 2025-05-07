export declare enum DOCUMENT_MODE {
  NO_QUIRKS = 'no-quirks',
  QUIRKS = 'quirks',
  LIMITED_QUIRKS = 'limited-quirks',
}

export declare enum TAG_ID {
  UNKNOWN = 0,
  A = 1,
  ADDRESS = 2,
  ANNOTATION_XML = 3,
  APPLET = 4,
  AREA = 5,
  ARTICLE = 6,
  ASIDE = 7,
  B = 8,
  BASE = 9,
  BASEFONT = 10,
  BGSOUND = 11,
  BIG = 12,
  BLOCKQUOTE = 13,
  BODY = 14,
  BR = 15,
  BUTTON = 16,
  CAPTION = 17,
  CENTER = 18,
  CODE = 19,
  COL = 20,
  COLGROUP = 21,
  DD = 22,
  DESC = 23,
  DETAILS = 24,
  DIALOG = 25,
  DIR = 26,
  DIV = 27,
  DL = 28,
  DT = 29,
  EM = 30,
  EMBED = 31,
  FIELDSET = 32,
  FIGCAPTION = 33,
  FIGURE = 34,
  FONT = 35,
  FOOTER = 36,
  FOREIGN_OBJECT = 37,
  FORM = 38,
  FRAME = 39,
  FRAMESET = 40,
  H1 = 41,
  H2 = 42,
  H3 = 43,
  H4 = 44,
  H5 = 45,
  H6 = 46,
  HEAD = 47,
  HEADER = 48,
  HGROUP = 49,
  HR = 50,
  HTML = 51,
  I = 52,
  IMG = 53,
  IMAGE = 54,
  INPUT = 55,
  IFRAME = 56,
  KEYGEN = 57,
  LABEL = 58,
  LI = 59,
  LINK = 60,
  LISTING = 61,
  MAIN = 62,
  MALIGNMARK = 63,
  MARQUEE = 64,
  MATH = 65,
  MENU = 66,
  META = 67,
  MGLYPH = 68,
  MI = 69,
  MO = 70,
  MN = 71,
  MS = 72,
  MTEXT = 73,
  NAV = 74,
  NOBR = 75,
  NOFRAMES = 76,
  NOEMBED = 77,
  NOSCRIPT = 78,
  OBJECT = 79,
  OL = 80,
  OPTGROUP = 81,
  OPTION = 82,
  P = 83,
  PARAM = 84,
  PLAINTEXT = 85,
  PRE = 86,
  RB = 87,
  RP = 88,
  RT = 89,
  RTC = 90,
  RUBY = 91,
  S = 92,
  SCRIPT = 93,
  SEARCH = 94,
  SECTION = 95,
  SELECT = 96,
  SOURCE = 97,
  SMALL = 98,
  SPAN = 99,
  STRIKE = 100,
  STRONG = 101,
  STYLE = 102,
  SUB = 103,
  SUMMARY = 104,
  SUP = 105,
  TABLE = 106,
  TBODY = 107,
  TEMPLATE = 108,
  TEXTAREA = 109,
  TFOOT = 110,
  TD = 111,
  TH = 112,
  THEAD = 113,
  TITLE = 114,
  TR = 115,
  TRACK = 116,
  TT = 117,
  U = 118,
  UL = 119,
  SVG = 120,
  VAR = 121,
  WBR = 122,
  XMP = 123,
}

export declare enum NS {
  HTML = 'http://www.w3.org/1999/xhtml',
  MATHML = 'http://www.w3.org/1998/Math/MathML',
  SVG = 'http://www.w3.org/2000/svg',
  XLINK = 'http://www.w3.org/1999/xlink',
  XML = 'http://www.w3.org/XML/1998/namespace',
  XMLNS = 'http://www.w3.org/2000/xmlns/',
}

export declare enum TokenType {
  CHARACTER = 0,
  NULL_CHARACTER = 1,
  WHITESPACE_CHARACTER = 2,
  START_TAG = 3,
  END_TAG = 4,
  COMMENT = 5,
  DOCTYPE = 6,
  EOF = 7,
  HIBERNATION = 8,
}
export interface Location {
  /** One-based line index of the first character. */
  startLine: number;
  /** One-based column index of the first character. */
  startCol: number;
  /** Zero-based first character index. */
  startOffset: number;
  /** One-based line index of the last character. */
  endLine: number;
  /** One-based column index of the last character. Points directly *after* the last character. */
  endCol: number;
  /** Zero-based last character index. Points directly *after* the last character. */
  endOffset: number;
}
export interface LocationWithAttributes extends Location {
  /** Start tag attributes' location info. */
  attrs?: Record<string, Location>;
}
export interface ElementLocation extends LocationWithAttributes {
  /** Element's start tag location info. */
  startTag?: Location;
  /**
   * Element's end tag location info.
   * This property is undefined, if the element has no closing tag.
   */
  endTag?: Location;
}
interface TokenBase {
  readonly type: TokenType;
  location: Location | null;
}
export interface DoctypeToken extends TokenBase {
  readonly type: TokenType.DOCTYPE;
  name: string | null;
  forceQuirks: boolean;
  publicId: string | null;
  systemId: string | null;
}
export interface Attribute {
  /** The name of the attribute. */
  name: string;
  /** The namespace of the attribute. */
  namespace?: string;
  /** The namespace-related prefix of the attribute. */
  prefix?: string;
  /** The value of the attribute. */
  value: string;
}
export interface TagToken extends TokenBase {
  readonly type: TokenType.START_TAG | TokenType.END_TAG;
  tagName: string;
  /** Used to cache the ID of the tag name. */
  tagID: TAG_ID;
  selfClosing: boolean;
  ackSelfClosing: boolean;
  attrs: Attribute[];
  location: LocationWithAttributes | null;
}

export interface Document {
  /** The name of the node. */
  nodeName: '#document';
  /**
   * Document mode.
   *
   * @see {@link DOCUMENT_MODE} */
  mode: DOCUMENT_MODE;
  /** The node's children. */
  childNodes: ChildNode[];
  /** Comment source code location info. Available if location info is enabled. */
  sourceCodeLocation?: Location | null;
}
export interface DocumentFragment {
  /** The name of the node. */
  nodeName: '#document-fragment';
  /** The node's children. */
  childNodes: ChildNode[];
  /** Comment source code location info. Available if location info is enabled. */
  sourceCodeLocation?: Location | null;
}
export interface Element {
  /** Element tag name. Same as {@link tagName}. */
  nodeName: string;
  /** Element tag name. Same as {@link nodeName}. */
  tagName: string;
  /** List of element attributes. */
  attrs: Attribute[];
  /** Element namespace. */
  namespaceURI: NS;
  /** Element source code location info, with attributes. Available if location info is enabled. */
  sourceCodeLocation?: ElementLocation | null;
  /** Parent node. */
  parentNode: ParentNode | null;
  /** The node's children. */
  childNodes: ChildNode[];
}
export interface CommentNode {
  /** The name of the node. */
  nodeName: '#comment';
  /** Parent node. */
  parentNode: ParentNode | null;
  /** Comment text. */
  data: string;
  /** Comment source code location info. Available if location info is enabled. */
  sourceCodeLocation?: Location | null;
}
export interface TextNode {
  nodeName: '#text';
  /** Parent node. */
  parentNode: ParentNode | null;
  /** Text content. */
  value: string;
  /** Comment source code location info. Available if location info is enabled. */
  sourceCodeLocation?: Location | null;
}
export interface Template extends Element {
  nodeName: 'template';
  tagName: 'template';
  /** The content of a `template` tag. */
  content: DocumentFragment;
}
export interface DocumentType {
  /** The name of the node. */
  nodeName: '#documentType';
  /** Parent node. */
  parentNode: ParentNode | null;
  /** Document type name. */
  name: string;
  /** Document type public identifier. */
  publicId: string;
  /** Document type system identifier. */
  systemId: string;
  /** Comment source code location info. Available if location info is enabled. */
  sourceCodeLocation?: Location | null;
}
export type ParentNode = Document | DocumentFragment | Element | Template;
export type ChildNode =
  | Element
  | Template
  | CommentNode
  | TextNode
  | DocumentType;
export type Node = ParentNode | ChildNode;
