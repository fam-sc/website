import { MouseEvent, useCallback, useState } from 'react';

import { Sticker } from '@/botFlow/types';
import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';

import { StickerImage } from '../StickerImage';
import styles from './index.module.scss';

export interface StickerSelectDialogProps {
  stickers: Sticker[];
  selectedStickerId?: string;

  onEmojiChanged?: (id: string) => void;
  onClose: () => void;
}

export function StickerSelectDialog({
  onClose,
  onEmojiChanged,
  selectedStickerId,
  stickers,
}: StickerSelectDialogProps) {
  const [selectedListSticker, setSelectedListSticker] =
    useState(selectedStickerId);

  const onSelect = useCallback(() => {
    if (selectedListSticker !== undefined) {
      onEmojiChanged?.(selectedListSticker);
    }

    onClose();
  }, [onClose, onEmojiChanged, selectedListSticker]);

  const onItemSelected = useCallback((event: MouseEvent) => {
    const { target } = event;
    const { key } = (target as HTMLElement).dataset;

    console.log(event.target);

    setSelectedListSticker(key);
  }, []);

  return (
    <ModalDialog
      title="Виберіть стікер"
      footer={
        <Button
          disabled={selectedListSticker === undefined}
          color="primary"
          buttonVariant="solid"
          onClick={onSelect}
        >
          Вибрати
        </Button>
      }
      onClose={onClose}
    >
      <div className={styles.grid}>
        {stickers.map((sticker) => (
          <StickerImage
            className={
              sticker.id === selectedListSticker
                ? styles['item-selected']
                : undefined
            }
            sticker={sticker}
            key={sticker.id}
            data-key={sticker.id}
            onClickCapture={onItemSelected}
          />
        ))}
      </div>
    </ModalDialog>
  );
}
