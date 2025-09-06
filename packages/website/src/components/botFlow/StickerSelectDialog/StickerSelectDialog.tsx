import { useCallback, useState } from 'react';

import { StickerInfo } from '@/api/botFlow/types';
import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { SelectableList } from '@/components/SelectableList';

import { StickerImage } from '../StickerImage';
import styles from './StickerSelectDialog.module.scss';

export interface StickerSelectDialogProps {
  stickers: StickerInfo[];
  selectedSticker?: StickerInfo;

  onEmojiChanged?: (id: StickerInfo) => void;
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
        {({ id, source }) => <StickerImage key={id} source={source} />}
      </SelectableList>
    </ModalDialog>
  );
}
