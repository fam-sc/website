import { motion } from 'motion/react';
import { useState } from 'react';

import { useScrollbar } from '@/hooks/useScrollbar';
import { classNames } from '@/utils/classNames';
import { ImageInfo } from '@/utils/image/types';

import { Image } from '../Image/Image';
import styles from './ImageGrid.module.scss';

export interface ImageGridProps {
  className?: string;
  images: ImageInfo[][];
}

interface ImageItemProps {
  setSelected: () => void;

  image: ImageInfo[];
}

function ImageItem({ image, setSelected }: ImageItemProps) {
  return (
    <motion.div
      className={styles.item}
      whileTap={{ scale: 0.9 }}
      initial={{ background: '#00000000' }}
      onTap={setSelected}
    >
      <Image multiple={image} />
    </motion.div>
  );
}

export function ImageGrid({ className, images }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useScrollbar(selectedIndex < 0);

  return (
    <div className={classNames(styles.root, className)}>
      {images.map((image, i) => (
        <ImageItem
          key={i}
          image={image}
          setSelected={() => setSelectedIndex(i)}
        />
      ))}

      {selectedIndex >= 0 && (
        <motion.div
          animate={{ background: '#00000080' }}
          className={styles.dialog}
          onTap={() => setSelectedIndex(-1)}
        >
          <Image multiple={images[selectedIndex]} />
        </motion.div>
      )}
    </div>
  );
}
