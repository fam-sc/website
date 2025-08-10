import { classNames } from '@/utils/classNames';

import { ImageEditor } from '../ImageEditor';
import { TextEditor } from '../TextEditor';
import { useVSCode } from '../VSCodeContext';
import styles from './Editor.module.scss';

export interface EditorProps {
  className?: string;
}

export function Editor({ className }: EditorProps) {
  const { currentFile } = useVSCode();

  return (
    currentFile && (
      <div className={classNames(styles.root, className)}>
        {currentFile.type === 'image' ? (
          <ImageEditor url={currentFile.url} />
        ) : (
          <TextEditor content={currentFile.content} />
        )}
      </div>
    )
  );
}
