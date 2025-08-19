import { useMemo, useState } from 'react';

import { Typography } from '@/components/Typography';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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
  depth: number;
}

function File({ item, depth }: FileProps) {
  const { openFile, setSidebarType } = useVSCode();
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <div
      className={styles.file}
      style={{ ['--depth']: depth }}
      onClick={() => {
        if (isMobile) {
          openFile(item.fullPath);
          setSidebarType(null);
        }
      }}
      onDoubleClick={() => {
        openFile(item.fullPath);
      }}
    >
      <FileTypeIcon type={item.type} />
      <Typography>{item.name}</Typography>
    </div>
  );
}

interface FolderProps {
  item: FolderItem;
  depth: number;
}

function Folder({ item, depth }: FolderProps) {
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

      {expanded && <FolderContent content={item.children} depth={depth + 1} />}
    </div>
  );
}

interface FolderContentProps {
  content: FileItem[];
  depth: number;
}

function FolderContent({ content, depth }: FolderContentProps) {
  return (
    <>
      {content.map((item) =>
        item.type === 'folder' ? (
          <Folder key={item.name} item={item} depth={depth} />
        ) : (
          <File key={item.name} item={item} depth={depth} />
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
      <FolderContent content={tree} depth={0} />
    </div>
  );
}
