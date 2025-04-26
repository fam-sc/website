'use client';

// Base unstyled (only functional) building block for file drop areas.

import { PropsMap, WithDataSpace } from '@/types/react';
import { useState } from 'react';

type DivProps = PropsMap['div'];

export interface BaseFileDropAreaProps extends DivProps, WithDataSpace<'over'> {
  disabled?: boolean;
  onFile?: (file: File) => void;
}

export function BaseFileDropArea({
  onFile,
  disabled,
  ...rest
}: BaseFileDropAreaProps) {
  const [isOver, setOver] = useState(false);

  function changeIsOver(value: boolean) {
    if (!disabled) {
      setOver(value);
    }
  }

  return (
    <div
      {...rest}
      data-over={isOver}
      onDragEnter={() => {
        changeIsOver(true);
      }}
      onDragLeave={() => {
        changeIsOver(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();

        changeIsOver(true);
      }}
      onDrop={(e) => {
        if (!disabled) {
          e.preventDefault();

          const { files } = e.dataTransfer;

          if (files.length > 0) {
            onFile?.(files[0]);
          }
        }
      }}
    />
  );
}
