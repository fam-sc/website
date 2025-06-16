import { ImageIcon } from '@/icons/ImageIcon';
import { useCurrentEditor } from '@tiptap/react';
import { useState } from 'react';
import { FileUploadDialog } from '../FileUploadDialog';
import { ToggleButton } from './ToggleButton';
import { ObjectUrlManager } from '@/utils/objectUrlManager';

export type InsertImageButtonProps = {
  urlManager: ObjectUrlManager;
};

export function InsertImageButton({ urlManager }: InsertImageButtonProps) {
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
            const src = urlManager.register(file);

            editor?.chain().focus().setImage({ src }).run();
          }}
        />
      )}
    </>
  );
}
