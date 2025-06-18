import { Editor } from '@tiptap/core';
import { EditorContent as TiptapEditorContent } from '@tiptap/react';
import { FileDrop } from '../FileDrop';
import { useCallback } from 'react';
import { ObjectUrlManager } from '@/utils/objectUrlManager';
import richTextStyles from '../RichText/index.module.scss';
import typographyStyles from '../Typography/index.module.scss';
import styles from './EditorContent.module.scss';

import { classNames } from '@/utils/classNames';
import { Typography } from '../Typography';

export interface EditorContentProps {
  disabled?: boolean;
  urlManager: ObjectUrlManager;
  editor: Editor | null;
}

export function EditorContent({
  disabled,
  urlManager,
  editor,
}: EditorContentProps) {
  const onFiles = useCallback(
    (files: FileList) => {
      for (const file of files) {
        const src = urlManager.register(file);

        editor?.chain().focus().setImage({ src }).run();
      }
    },
    [editor, urlManager]
  );

  return (
    <FileDrop disabled={disabled} onFiles={onFiles}>
      <div className={styles.root}>
        <TiptapEditorContent
          draggable={false}
          className={classNames(
            typographyStyles.root,
            typographyStyles['root-variant-body'],
            richTextStyles.root
          )}
          editor={editor}
        />

        <div className={styles['drop-overlay']} draggable={false}>
          <Typography>Переність картинку</Typography>
        </div>
      </div>
    </FileDrop>
  );
}
