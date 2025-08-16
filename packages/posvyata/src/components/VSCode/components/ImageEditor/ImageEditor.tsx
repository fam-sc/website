import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import styles from './ImageEditor.module.scss';

export interface ImageEditorProps {
  url: string;
}

export function ImageEditor({ url }: ImageEditorProps) {
  return (
    <div className={styles.root}>
      <TransformWrapper>
        <TransformComponent>
          <div className={styles.wrapper}>
            <img src={url} loading="lazy" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
