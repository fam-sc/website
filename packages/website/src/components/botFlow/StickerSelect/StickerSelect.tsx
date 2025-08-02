import { useCallback, useState } from 'react';

import { Typography } from '@/components/Typography';

import { Button } from '../../Button';
import { StickerImage } from '../StickerImage';
import { StickerSelectDialog } from '../StickerSelectDialog';

export type StickerSelectProps = {
  stickers: string[];
  selectedStickerId?: string;
  onEmojiChanged?: (emoji: string) => void;
};

export function StickerSelect({
  stickers,
  selectedStickerId,
  onEmojiChanged,
}: StickerSelectProps) {
  const selectedSticker = stickers.find(
    (sticker) => sticker === selectedStickerId
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
          <StickerImage stickerId={selectedSticker} />
        ) : (
          <Typography>?</Typography>
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
