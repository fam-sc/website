import { ChainedCommands, Editor } from '@tiptap/core';
import { useCurrentEditor } from '@tiptap/react';
import { ReactNode, useCallback } from 'react';

import { classNames } from '@/utils/classNames';

import { IconButton } from '../../IconButton';
import styles from './ToggleButton.module.scss';

type ToggleKey = {
  [K in keyof ChainedCommands]: K extends `toggle${string}`
    ? ChainedCommands[K] extends () => ChainedCommands
      ? K
      : never
    : never;
}[keyof ChainedCommands];

type ClickHandler =
  | { toggle: ToggleKey }
  | {
      onToggle: (commands: ChainedCommands) => ChainedCommands;
    }
  | { onClick: (editor: Editor) => void };

type ToggleButtonProps = ClickHandler & {
  isActive?: boolean;
  title: string;
  className?: string;
  children: ReactNode;
};

export function ToggleButton({
  isActive,
  children,
  title,
  className,
  ...rest
}: ToggleButtonProps) {
  const { editor } = useCurrentEditor();

  const onClick = useCallback(() => {
    if (editor !== null) {
      if ('onToggle' in rest) {
        rest.onToggle(editor.chain().focus()).run();
      } else if ('toggle' in rest) {
        editor.chain().focus()[rest.toggle]().run();
      } else {
        rest.onClick(editor);
      }
    }
  }, [editor, rest]);

  return (
    <IconButton
      role="checkbox"
      aria-checked={isActive}
      className={classNames(styles.root, className)}
      title={title}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
}
