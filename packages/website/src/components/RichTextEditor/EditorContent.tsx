import { Editor } from '@tiptap/core';
import { EditorContent as TiptapEditorContent } from '@tiptap/react';
import { useCallback } from 'react';

import { classNames } from '@/utils/classNames';
import { imageFileGate, isAllFilesValid } from '@/utils/fileGate';
import { ObjectUrlManager } from '@/utils/objectUrlManager';

import { FileDrop } from '../FileDrop';
import { useNotification } from '../Notification';
import richTextStyles from '../RichText/RichText.module.scss';
import { Typography } from '../Typography';
import typographyStyles from '../Typography/Typography.module.scss';
import styles from './EditorContent.module.scss';

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
  const notification = useNotification();

  const onFiles = useCallback(
    async (files: FileList) => {
      const isValid = await isAllFilesValid(imageFileGate, files);

      if (isValid) {
        for (const file of files) {
          const src = urlManager.register(file);

          editor?.chain().focus().setImage({ src }).run();
        }
      } else {
        notification.show('Можна вставляти тільки картинки', 'error');
      }
    },
    [editor, notification, urlManager]
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
