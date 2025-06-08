// Base unstyled (only functional) building block for file drop areas.

import { PropsMap, WithDataSpace } from '@/types/react';
import { useState } from 'react';
import { Typography } from '../Typography';
import { UploadFileButton } from '../UploadFileButton';

type DivProps = PropsMap['div'];

export interface BaseFileDropAreaProps extends DivProps, WithDataSpace<'over'> {
  disabled?: boolean;
  accept?: string;

  uploadText?: string;
  dragText?: string;

  onFiles?: (files: FileList) => void;
}

export function BaseFileDropArea({
  onFiles,
  disabled,
  accept,
  uploadText,
  dragText,
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

          onFiles?.(e.dataTransfer.files);
          setOver(false);
        }
      }}
    >
      <UploadFileButton
        accept={accept}
        onFiles={onFiles}
        disabled={disabled}
        buttonVariant="solid"
        text={uploadText}
      />

      <Typography>{dragText ?? 'Або перетяніть його'}</Typography>
    </div>
  );
}
