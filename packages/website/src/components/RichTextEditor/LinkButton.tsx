import { useCurrentEditor } from '@tiptap/react';
import { useState } from 'react';

import { LinkIcon } from '@/icons/LinkIcon';

import { SelectLinkDialog } from '../SelectLinkDialog';
import { ToggleButton } from './ToggleButton';

type LinkButtonProps = {
  isActive: boolean;
};

export function LinkButton({ isActive }: LinkButtonProps) {
  const { editor } = useCurrentEditor();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ToggleButton
        isActive={isActive}
        title="Додати посилання"
        onClick={(editor) => {
          if (isActive) {
            editor.chain().focus().unsetLink().run();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <LinkIcon />
      </ToggleButton>

      {isOpen && (
        <SelectLinkDialog
          onClose={() => {
            setIsOpen(false);
          }}
          onConfirmed={({ link }) => {
            setIsOpen(false);

            editor?.chain().focus().setLink({ href: link }).run();
          }}
        />
      )}
    </>
  );
}
