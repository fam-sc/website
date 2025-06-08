

import { Ref, useEffect, useImperativeHandle } from 'react';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import ImageExtension from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  EditorContent,
  EditorContext,
  Extensions,
  useEditor,
} from '@tiptap/react';

import richTextStyles from '../RichText/index.module.scss';
import typographyStyles from '../Typography/index.module.scss';
import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';
import { Menu, useMenuOptions } from './Menu';

const extensions: Extensions = [
  Document,
  Text,
  Paragraph,
  Bold,
  Italic,
  Strike,
  Blockquote,
  Heading,
  Underline,
  Subscript,
  Superscript,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link,
  ImageExtension.configure({
    allowBase64: true,
  }),
];

export type RichTextEditorRef = {
  getHTMLText(): string;
};

type RichTextEditorProps = {
  /**
   * Rich text in HTML.
   */
  text: string;

  ref?: Ref<RichTextEditorRef>;

  onIsEmptyChanged?: (value: boolean) => void;

  className?: string;
  disabled?: boolean;
};

export function RichTextEditor({
  className,
  text,
  ref,
  onIsEmptyChanged,
  disabled,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions,
    content: text,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => {
      onIsEmptyChanged?.(editor.isEmpty);
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      getHTMLText: () => editor?.getHTML() ?? '',
    }),
    [editor]
  );

  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);

  const menuOptions = useMenuOptions(editor);

  return (
    <div
      className={classNames(styles.root, className)}
      aria-disabled={disabled}
    >
      <EditorContext.Provider value={{ editor }}>
        <Menu options={menuOptions} />
        <EditorContent
          data-variant="body"
          className={classNames(typographyStyles.root, richTextStyles.root)}
          editor={editor}
        />
      </EditorContext.Provider>
    </div>
  );
}
