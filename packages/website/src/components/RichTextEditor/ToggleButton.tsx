import { ChainedCommands, Editor } from '@tiptap/core';
import { useCurrentEditor } from '@tiptap/react';
import { ReactNode } from 'react';
import { IconButton } from '../IconButton';
import styles from './ToggleButton.module.scss';

type ToggleButtonProps = {
  isActive?: boolean;
  title: string;
  children: ReactNode;
} & (
  | {
      onToggle: (commands: ChainedCommands) => ChainedCommands;
    }
  | { onClick: (editor: Editor) => void }
);

export function ToggleButton({
  isActive,
  children,
  title,
  ...rest
}: ToggleButtonProps) {
  const { editor } = useCurrentEditor();

  return (
    <IconButton
      role="checkbox"
      aria-checked={isActive}
      className={styles.root}
      title={title}
      onClick={() => {
        if (editor !== null) {
          if ('onToggle' in rest) {
            rest.onToggle(editor.chain().focus()).run();
          } else {
            rest.onClick(editor);
          }
        }
      }}
    >
      {children}
    </IconButton>
  );
}
