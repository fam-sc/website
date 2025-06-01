import { ImageIcon } from '@/icons/ImageIcon';
import { useCurrentEditor } from '@tiptap/react';
import { useState } from 'react';
import { FileUploadDialog } from '../FileUploadDialog';
import { ToggleButton } from './ToggleButton';

export function InsertImageButton() {
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

            // TODO: Somehow revoke this URL.
            const src = URL.createObjectURL(file);

            editor?.chain().focus().setImage({ src }).run();
          }}
        />
      )}
    </>
  );
}
