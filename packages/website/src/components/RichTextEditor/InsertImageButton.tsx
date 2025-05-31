import { ImageIcon } from '@/icons/ImageIcon';
import { fileToDataUrl } from '@/utils/fileTransformations';
import { useCurrentEditor } from '@tiptap/react';
import { useState } from 'react';
import { FileUploadDialog } from '../FileUploadDialog';
import { useNotification } from '../Notification';
import { ToggleButton } from './ToggleButton';

export function InsertImageButton() {
  const notification = useNotification();
  const { editor } = useCurrentEditor();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ToggleButton
        title="Додати зображення"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <ImageIcon />
      </ToggleButton>

      {isOpen && (
        <FileUploadDialog
          accept=".png, .jpeg, .jpg, .webp"
          onClose={() => {
            setIsOpen(false);
          }}
          onSubmit={(file) => {
            setIsOpen(false);

            fileToDataUrl(file)
              .then((src) => {
                editor?.chain().focus().setImage({ src }).run();
              })
              .catch((error: unknown) => {
                console.error(error);

                notification.show('Сталася помилка', 'error');
              });
          }}
        />
      )}
    </>
  );
}
