// Base unstyled (only functional) building block for file drop areas.

import { PropsMap, WithDataSpace } from '@/types/react';
import { Typography } from '../Typography';
import { UploadFileButton } from '../UploadFileButton';
import { FileDrop } from '../FileDrop';
import { FileGate, isAllFilesValid } from '@/utils/fileGate';
import { useCallback } from 'react';

type DivProps = PropsMap['div'];

export interface BaseFileDropAreaProps extends DivProps, WithDataSpace<'over'> {
  disabled?: boolean;
  accept?: FileGate;

  uploadText?: string;
  dragText?: string;

  onFiles?: (files: FileList) => void;
}

export function BaseFileDropArea({
  onFiles,
  disabled,
  accept: gate,
  uploadText,
  dragText,
  ...rest
}: BaseFileDropAreaProps) {
  const gateOnFiles = useCallback(
    (files: FileList) => {
      if (gate) {
        isAllFilesValid(gate, files)
          .then((result) => {
            if (result) {
              onFiles?.(files);
            }
          })
          .catch((error: unknown) => {
            console.error(error);
          });
      } else {
        onFiles?.(files);
      }
    },
    [gate, onFiles]
  );

  return (
    <FileDrop onFiles={gateOnFiles} disabled={disabled}>
      <div {...rest}>
        <UploadFileButton
          accept={gate?.acceptTypes}
          onFiles={gateOnFiles}
          disabled={disabled}
          buttonVariant="solid"
          text={uploadText}
        />

        <Typography>{dragText ?? 'Або перетяніть його'}</Typography>
      </div>
    </FileDrop>
  );
}
