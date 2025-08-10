import { useMemo, useState } from 'react';

import { Typography } from '@/components/Typography';
import { ChevronDown } from '@/icons/ChevronDown';
import { ChevronUp } from '@/icons/ChevronUp';
import { classNames } from '@/utils/classNames';

import {
  FileItem,
  FolderItem,
  parseFileTree,
  SimpleFileItem,
} from '../../utils/fileTree';
import { FileTypeIcon } from '../FileTypeIcon/FileTypeIcon';
import { useVSCode } from '../VSCodeContext';
import styles from './FilesTab.module.scss';

export interface FilesTabProps {
  className?: string;
}

interface FileProps {
  item: SimpleFileItem;
}

function File({ item }: FileProps) {
  const { openFile } = useVSCode();

  return (
    <div className={styles.file} onDoubleClick={() => openFile(item.fullPath)}>
      <FileTypeIcon type={item.type} />
      <Typography>{item.name}</Typography>
    </div>
  );
}

interface FolderProps {
  item: FolderItem;
}

function Folder({ item }: FolderProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={styles['folder-header']}
        onClick={() => setExpanded((state) => !state)}
      >
        {expanded ? <ChevronUp /> : <ChevronDown />}
        <Typography>{item.name}</Typography>
      </div>

      {expanded && (
        <div className={styles['folder-content']}>
          <FolderContent content={item.children} />
        </div>
      )}
    </div>
  );
}

interface FolderContentProps {
  content: FileItem[];
}

function FolderContent({ content }: FolderContentProps) {
  return (
    <>
      {content.map((item) =>
        item.type === 'folder' ? (
          <Folder key={item.name} item={item} />
        ) : (
          <File key={item.name} item={item} />
        )
      )}
    </>
  );
}

export function FilesTab({ className }: FilesTabProps) {
  const { files } = useVSCode();
  const tree = useMemo(() => parseFileTree(files), [files]);

  return (
    <div className={classNames(styles.root, className)}>
      <FolderContent content={tree} />
    </div>
  );
}
