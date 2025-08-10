import { Typography } from '@/components/Typography';
import { CloseIcon } from '@/icons/CloseIcon';
import { classNames } from '@/utils/classNames';
import { getFileName } from '@/utils/file';

import { VSCodeFile } from '../../types';
import { FileTypeIcon } from '../FileTypeIcon/FileTypeIcon';
import { useVSCode } from '../VSCodeContext';
import styles from './FileList.module.scss';

export interface FileListProps {
  className?: string;
}

interface ItemProps {
  isActive: boolean;
  item: VSCodeFile;
}

function Item({ isActive, item }: ItemProps) {
  const { openFile, closeFile } = useVSCode();

  return (
    <div
      className={classNames(styles.item, isActive && styles[`item-active`])}
      onClick={() => openFile(item.path)}
    >
      <FileTypeIcon className={styles['item-type']} type={item.type} />
      <Typography>{getFileName(item.path)}</Typography>

      <button
        className={styles['item-close']}
        onClick={() => closeFile(item.path)}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export function FileList({ className }: FileListProps) {
  const { currentFile, openedFiles } = useVSCode();

  return (
    <div className={classNames(styles.root, className)}>
      {openedFiles.map((item) => (
        <Item
          key={item.path}
          item={item}
          isActive={currentFile?.path === item.path}
        />
      ))}
    </div>
  );
}
