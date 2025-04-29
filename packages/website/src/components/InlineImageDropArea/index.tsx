import { PropsMap } from '@/types/react';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';
import { UploadFileButton } from '../UploadFileButton';
import { Typography } from '../Typography';
import { ImageBlur } from '../ImageBlur';
import { IconButton } from '../IconButton';
import { CloseIcon } from '@/icons/CloseIcon';

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
  return (
    <div
      className={classNames(styles.root, className)}
      data-disabled={disabled}
      {...rest}
    >
      {imageSrc === undefined ? (
        <BaseFileDropArea
          disabled={disabled}
          onFile={onFile}
          className={styles['drop-area']}
        >
          <UploadFileButton
            disabled={disabled}
            buttonVariant="solid"
            onFile={onFile}
          />

          <Typography>Або перетяніть його</Typography>
        </BaseFileDropArea>
      ) : (
        <>
          <ImageBlur src={imageSrc} alt="" width={0} height={0} />
          <IconButton
            hover="fill"
            className={styles['delete-image']}
            onClick={() => {
              onFile(undefined);
            }}
          >
            <CloseIcon />
          </IconButton>
        </>
      )}
    </div>
  );
}
