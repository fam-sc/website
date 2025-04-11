import { useState } from 'react';

import { Typography } from '../Typography';

import buttonStyles from '../Button/index.module.scss';
import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

export type FileDropAreaProps = {
  className?: string;
  accept?: string;
  onFile?: (file: File) => void;
};

export function FileDropArea({ onFile, accept, className }: FileDropAreaProps) {
  const [isOver, setOver] = useState(false);

  return (
    <div
      className={classNames(styles.root, className)}
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
    >
      <label
        role="button"
        className={classNames(buttonStyles.root, buttonStyles['root-primary'])}
      >
        <input
          type="file"
          accept={accept}
          onChange={(event) => {
            const { files } = event.target;

            if (files !== null && files.length > 0) {
              onFile?.(files[0]);
            }
          }}
        />
        Виберіть файл
      </label>

      <Typography>Або перетяніть його</Typography>
    </div>
  );
}
