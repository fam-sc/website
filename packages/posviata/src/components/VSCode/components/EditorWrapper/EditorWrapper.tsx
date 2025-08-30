import { classNames } from '@sc-fam/shared';

import { Editor } from '../Editor';
import { FileList } from '../FileList';
import styles from './EditorWrapper.module.scss';

export interface EditorWrapperProps {
  className?: string;
}

export function EditorWrapper({ className }: EditorWrapperProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <FileList className={styles.tabs} />

      <Editor />
    </div>
  );
}
