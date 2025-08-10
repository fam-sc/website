import { UIEvent, useCallback, useRef, useState, WheelEvent } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import styles from './ImageEditor.module.scss';

export interface ImageEditorProps {
  url: string;
}

export function ImageEditor({ url }: ImageEditorProps) {
  const [scale, setScale] = useState(1);
  const isActionPressed = useRef(true);

  const onImageClick = () => {
    setScale((scale) => scale * 1.25);
  };
  /*

  const onWheel = (event: WheelEvent) => {
    if (isActionPressed.current) {
      event.preventDefault();

      let factor = 1.25;
      if (event.deltaY < 0) {
        factor = 1 / factor;
      }

      setScale((scale) => scale * factor);
    }
  };
  */

  return (
    <div className={styles.root}>
      <TransformWrapper>
        <TransformComponent>
          <div className={styles.wrapper}>
            <img
              src={url}
              loading="lazy"
              style={{ '--scale': scale }}
              onClick={onImageClick}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
