import { PropsMap } from '@/types/react';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';
import { ImageBlur } from '../ImageBlur';
import { DeleteButtonWrapper } from '../DeleteButtonWrapper';
import { VarImageType } from '../VarImage';
import { imageFileGate } from '@/utils/fileGate';

type DivProps = PropsMap['div'];

export interface InlineImageDropAreaProps extends DivProps {
  disabled?: boolean;
  image?: VarImageType;
  onFile: (file: File | undefined) => void;
}

export function InlineImageDropArea({
  className,
  disabled,
  onFile,
  image,
  ...rest
}: InlineImageDropAreaProps) {
  function selectSingleFile(files: FileList) {
    if (files.length > 0) {
      onFile(files[0]);
    }
  }

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      {image === undefined ? (
        <BaseFileDropArea
          disabled={disabled}
          accept={imageFileGate}
          onFiles={selectSingleFile}
          className={styles['drop-area']}
        />
      ) : (
        <DeleteButtonWrapper
          className={styles['image-blur-wrapper']}
          disabled={disabled}
          onDelete={() => {
            onFile(undefined);
          }}
        >
          <ImageBlur image={image} />
        </DeleteButtonWrapper>
      )}
    </div>
  );
}
