import { PropsMap } from '@/types/react';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';
import { ImageBlur } from '../ImageBlur';
import { DeleteButtonWrapper } from '../DeleteButtonWrapper';

type DivProps = PropsMap['div'];

export interface InlineImageDropAreaProps extends DivProps {
  disabled?: boolean;
  imageSrc?: string;
  onFile: (file: File | undefined) => void;
}

export function InlineImageDropArea({
  className,
  disabled,
  onFile,
  imageSrc,
  ...rest
}: InlineImageDropAreaProps) {
  function selectSingleFile(files: FileList) {
    if (files.length > 0) {
      onFile(files[0]);
    }
  }

  return (
    <div
      className={classNames(styles.root, className)}
      data-disabled={disabled}
      {...rest}
    >
      {imageSrc === undefined ? (
        <BaseFileDropArea
          disabled={disabled}
          onFiles={selectSingleFile}
          className={styles['drop-area']}
        />
      ) : (
        <DeleteButtonWrapper
          onDelete={() => {
            onFile(undefined);
          }}
        >
          <ImageBlur src={imageSrc} alt="" width={0} height={0} />
        </DeleteButtonWrapper>
      )}
    </div>
  );
}
