import { ChainedCommands } from '@tiptap/core';
import { useCallback } from 'react';

import { HeaderLevel } from '../types';
import styles from './HeaderButton.module.scss';
import { ToggleButton } from './ToggleButton';

export interface HeaderButtonProps {
  level: HeaderLevel;
  isActive: boolean;
}

export function HeaderButton({ level, isActive }: HeaderButtonProps) {
  const onToggle = useCallback(
    (c: ChainedCommands) => c.toggleHeading({ level }),
    [level]
  );

  return (
    <ToggleButton
      isActive={isActive}
      title={`Заголовок рівня ${level}`}
      onToggle={onToggle}
      className={styles.header}
    >
      {`H${level}`}
    </ToggleButton>
  );
}
