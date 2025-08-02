import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { SelectableList } from '@/components/SelectableList';

import { StickerImage } from '../StickerImage';
import styles from './StickerSelectDialog.module.scss';

export interface StickerSelectDialogProps {
  stickers: string[];
  selectedSticker?: string;

  onEmojiChanged?: (id: string) => void;
  onClose: () => void;
}

export function StickerSelectDialog({
  onClose,
  onEmojiChanged,
  selectedSticker,
  stickers,
}: StickerSelectDialogProps) {
  const listStickers = useMemo(
    () => stickers.map((id) => ({ id })),
    [stickers]
  );
  const [selectedListSticker, setSelectedListSticker] = useState(
    selectedSticker ? { id: selectedSticker } : undefined
  );

  const onSelect = useCallback(() => {
    if (selectedListSticker !== undefined) {
      onEmojiChanged?.(selectedListSticker.id);
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
        items={listStickers}
        selectedItem={selectedListSticker}
        onSelect={setSelectedListSticker}
      >
        {({ id }) => <StickerImage key={id} stickerId={id} />}
      </SelectableList>
    </ModalDialog>
  );
}
