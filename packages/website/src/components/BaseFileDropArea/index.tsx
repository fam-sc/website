// Base unstyled (only functional) building block for file drop areas.

import { PropsMap, WithDataSpace } from '@/types/react';
import { Typography } from '../Typography';
import { UploadFileButton } from '../UploadFileButton';
import { FileDrop } from '../FileDrop';

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
  return (
    <FileDrop onFiles={onFiles} disabled={disabled}>
      <div {...rest}>
        <UploadFileButton
          accept={accept}
          onFiles={onFiles}
          disabled={disabled}
          buttonVariant="solid"
          text={uploadText}
        />

        <Typography>{dragText ?? 'Або перетяніть його'}</Typography>
      </div>
    </FileDrop>
  );
}
