import { EditorContext, useEditor } from '@tiptap/react';
import { Ref, useEffect, useImperativeHandle, useMemo } from 'react';

import { classNames } from '@/utils/classNames';
import { ObjectUrlManager } from '@/utils/objectUrlManager';
import {
  SerializeResultWithFiles,
  tiptapTextToRichText,
} from '@/utils/tiptap/serializer';

import { EditorContent } from './EditorContent';
import { extensions } from './extensions';
import { Menu, useMenuOptions } from './Menu';
import styles from './RichTextEditor.module.scss';

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
