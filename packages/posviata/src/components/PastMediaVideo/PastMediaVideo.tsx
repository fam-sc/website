import { classNames } from '@sc-fam/shared';
import { useCallback, useRef } from 'react';

import styles from './PastMediaVideo.module.scss';

export interface PastMediaVideoProps {
  className?: string;
  path: string;
}

export function PastMediaVideo({ className, path }: PastMediaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onMouseEnter = useCallback(() => {
    const video = videoRef.current;

    if (video) {
      void video.play();
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    const video = videoRef.current;

    if (video) {
      video.currentTime = 0;
      video.pause();
    }
  }, []);

  return (
    <div
      className={classNames(styles.root, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <video src={path} ref={videoRef} muted controls={false} />
    </div>
  );
}
