import { Ref, useEffect, useImperativeHandle, useMemo } from 'react';

import { EditorContext, useEditor } from '@tiptap/react';

import { classNames } from '@/utils/classNames';
import { Menu, useMenuOptions } from './Menu';
import { extensions } from './extensions';
import {
  SerializeResultWithFiles,
  tiptapTextToRichText,
} from '@/utils/tiptap/serializer';
import { ObjectUrlManager } from '@/utils/objectUrlManager';
import styles from './index.module.scss';
import { EditorContent } from './EditorContent';

export type RichTextEditorRef = {
  getRichText(): SerializeResultWithFiles | null;
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

  const urlManager = useMemo(() => new ObjectUrlManager(), []);

  useImperativeHandle(
    ref,
    () => ({
      getRichText: () => {
        if (editor) {
          return tiptapTextToRichText(editor.state.doc.content, editor.schema, {
            files: urlManager.filesMap,
          });
        }

        return null;
      },
    }),
    [editor, urlManager.filesMap]
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
        <Menu urlManager={urlManager} options={menuOptions} />

        <EditorContent urlManager={urlManager} editor={editor} />
      </EditorContext.Provider>
    </div>
  );
}
