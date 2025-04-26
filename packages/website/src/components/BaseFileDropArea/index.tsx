'use client';

// Base unstyled (only functional) building block for file drop areas.

import { PropsMap, WithDataSpace } from '@/types/react';
import { useState } from 'react';

type DivProps = PropsMap['div'];

export interface BaseFileDropAreaProps extends DivProps, WithDataSpace<'over'> {
  onFile?: (file: File) => void;
}

export function BaseFileDropArea({ onFile, ...rest }: BaseFileDropAreaProps) {
  const [isOver, setOver] = useState(false);

  return (
    <div
      {...rest}
      data-over={isOver}
      onDragEnter={() => {
        setOver(true);
      }}
      onDragLeave={() => {
        setOver(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();

        setOver(true);
      }}
      onDrop={(e) => {
        e.preventDefault();

        const { files } = e.dataTransfer;

        if (files.length > 0) {
          onFile?.(files[0]);
        }
      }}
    />
  );
}
