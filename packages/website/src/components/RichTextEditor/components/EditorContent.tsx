import { classNames } from '@sc-fam/shared';
import { useNotification } from '@sc-fam/shared-ui/src/components/Notification';
import { Editor } from '@tiptap/core';
import { EditorContent as TiptapEditorContent } from '@tiptap/react';
import { useCallback } from 'react';

import { imageFileGate, isAllFilesValid } from '@/utils/fileGate';
import { ObjectUrlManager } from '@/utils/objectUrlManager';

import { FileDrop } from '../../FileDrop';
import richTextStyles from '../../RichText/RichText.module.scss';
import { ScrollDetect } from '../../ScrollDetect';
import { Typography } from '../../Typography';
import typographyStyles from '../../Typography/Typography.module.scss';
import styles from './EditorContent.module.scss';

export interface EditorContentProps {
  disabled?: boolean;
  urlManager: ObjectUrlManager;
  editor: Editor | null;
  onScrollStatusChanged: (zeroScroll: boolean) => void;
}

export function EditorContent({
  disabled,
  urlManager,
  editor,
  onScrollStatusChanged,
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

  const onScrollEnd = useCallback(
    (event: Event) => {
      const scrollTop = (event.target as HTMLDivElement).scrollTop;

      onScrollStatusChanged(scrollTop === 0);
    },
    [onScrollStatusChanged]
  );

  return (
    <FileDrop disabled={disabled} onFiles={onFiles}>
      <ScrollDetect onScrollEnd={onScrollEnd}>
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
      </ScrollDetect>
    </FileDrop>
  );
}
