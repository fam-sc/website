import { classNames } from '@sc-fam/shared';
import { useMemo } from 'react';

import { countLines } from '@/utils/markdown/countLines';
import { RawMarkdownString } from '@/utils/markdown/types';

import { LineNumbers } from '../LineNumbers';
import { MarkdownContent } from '../MarkdownContent';
import styles from './TextEditor.module.scss';

export interface TextEditorProps {
  className?: string;
  content: RawMarkdownString;
}

export function TextEditor({ className, content }: TextEditorProps) {
  const lineCount = useMemo(() => countLines(content), [content]);

  return (
    <div className={classNames(styles.root, className)}>
      <LineNumbers count={lineCount} />
      <MarkdownContent text={content} className={styles.content} />
    </div>
  );
}
