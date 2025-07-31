import { useCallback, useState } from 'react';

import { Sticker } from '@/api/botFlow/types';
import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { SelectableList } from '@/components/SelectableList';

import { StickerImage } from '../StickerImage';
import styles from './StickerSelectDialog.module.scss';

export interface StickerSelectDialogProps {
  stickers: Sticker[];
  selectedSticker?: Sticker;

  onEmojiChanged?: (id: Sticker) => void;
  onClose: () => void;
}

export function StickerSelectDialog({
  onClose,
  onEmojiChanged,
  selectedSticker,
  stickers,
}: StickerSelectDialogProps) {
  const [selectedListSticker, setSelectedListSticker] =
    useState(selectedSticker);

  const onSelect = useCallback(() => {
    if (selectedListSticker !== undefined) {
      onEmojiChanged?.(selectedListSticker);
    }

    onClose();
  }, [onClose, onEmojiChanged, selectedListSticker]);

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
      <SelectableList
        className={styles.grid}
        items={stickers}
        selectedItem={selectedListSticker}
        onSelect={setSelectedListSticker}
      >
        {(sticker) => <StickerImage key={sticker.id} sticker={sticker} />}
      </SelectableList>
    </ModalDialog>
  );
}
