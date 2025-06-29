import {
  array,
  discriminatedUnion,
  int,
  literal,
  number,
  object,
  optional,
  positive,
  record,
  string,
  templateLiteral,
  union,
  z,
  ZodMiniType,
} from 'zod/v4-mini';

import { RichTextAtomNode, RichTextNode, supportedRichTextTags } from './types';

const dimension = number().check(positive(), int());

const filePath = templateLiteral(['rich-text-image/', string()]);

export const elementNode: ZodMiniType<RichTextAtomNode> = discriminatedUnion(
  'name',
  [
    object({
      name: z.enum(supportedRichTextTags),
      attrs: optional(record(string(), string())),
      get children() {
        return optional(array(atomcNode));
      },
    }),
    object({
      name: literal('#placeholder-image'),
      id: number(),
    }),
    object({
      name: literal('#unsized-image'),
      filePath,
    }),
    object({
      name: literal('#image'),
      filePath,
      sizes: array(
        object({
          width: dimension,
          height: dimension,
        })
      ),
    }),
  ]
);

export const atomcNode = union([string(), elementNode]);

export const node: ZodMiniType<RichTextNode> = union([
  atomcNode,
  array(atomcNode),
]);

export const richText = node;
