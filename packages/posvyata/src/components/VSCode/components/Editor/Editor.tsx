import React, { Suspense } from 'react';

import { LoadingIndicatorWrapper } from '@/components/LoadingIndicatorWrapper';
import { classNames } from '@/utils/classNames';

import { TextEditor } from '../TextEditor';
import { useVSCode } from '../VSCodeContext';
import styles from './Editor.module.scss';

export interface EditorProps {
  className?: string;
}

const ImageEditor = React.lazy(async () => {
  const { ImageEditor } = await import('../ImageEditor');

  return { default: ImageEditor };
});

export function Editor({ className }: EditorProps) {
  const { currentFile } = useVSCode();

  console.log(currentFile);

  return (
    currentFile && (
      <div className={classNames(styles.root, className)}>
        {currentFile.type === 'image' ? (
          <Suspense fallback={<LoadingIndicatorWrapper />}>
            <ImageEditor url={currentFile.url} />
          </Suspense>
        ) : (
          <TextEditor content={currentFile.content} />
        )}
      </div>
    )
  );
}
