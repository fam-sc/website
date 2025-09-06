import { useCallback, useState } from 'react';

import { StickerInfo } from '@/api/botFlow/types';

import { Button } from '../../Button';
import { StickerImage } from '../StickerImage';
import { StickerSelectDialog } from '../StickerSelectDialog';

export type StickerSelectProps = {
  stickers: StickerInfo[];
  selectedStickerId?: string;
  onEmojiChanged?: (emoji: StickerInfo) => void;
};

export function StickerSelect({
  stickers,
  selectedStickerId,
  onEmojiChanged,
}: StickerSelectProps) {
  const selectedSticker = stickers.find(
    (sticker) => sticker.id === selectedStickerId
  );

  const [isOpen, setIsOpen] = useState(false);

  const onShow = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Button buttonVariant="flat-inverted" onClick={onShow}>
        {selectedSticker ? (
          <StickerImage source={selectedSticker.source} />
        ) : (
          '?'
        )}
      </Button>

      {isOpen && (
        <StickerSelectDialog
          onClose={onClose}
          stickers={stickers}
          onEmojiChanged={onEmojiChanged}
          selectedSticker={selectedSticker}
        />
      )}
    </>
  );
}
