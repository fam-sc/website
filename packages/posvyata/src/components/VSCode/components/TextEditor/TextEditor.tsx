import { classNames } from '@/utils/classNames';
import { RawMarkdownString } from '@/utils/markdown/types';

import { LineNumbers } from '../LineNumbers';
import { MarkdownContent } from '../MarkdownContent';
import styles from './TextEditor.module.scss';

export interface TextEditorProps {
  className?: string;
  content: RawMarkdownString;
}

export function TextEditor({ className, content }: TextEditorProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <LineNumbers count={2} />
      <MarkdownContent text={content} className={styles.content} />
    </div>
  );
}
