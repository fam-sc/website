import { useCallback, useState } from 'react';

import { StickerId } from '@/api/botFlow/types';
import { Typography } from '@/components/Typography';

import { Button } from '../../Button';
import { StickerImage } from '../StickerImage';
import { StickerSelectDialog } from '../StickerSelectDialog';

export type StickerSelectProps = {
  stickers: StickerId[];
  selectedStickerId?: StickerId;
  onEmojiChanged?: (emoji: StickerId) => void;
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
          <StickerImage stickerKey={selectedSticker} />
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
