'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Button } from '../Button';
import { ModalDialog } from '../ModalDialog';

import styles from './index.module.scss';

import { Sticker } from '@/botFlow/types';

export type StickerSelectProps = {
  stickers: Sticker[];
  selectedStickerId?: string;
  onEmojiChanged?: (emoji: string) => void;
};

function StickerImage({ sticker }: { sticker: Sticker }) {
  return (
    <Image
      className={styles['sticker']}
      src={sticker.source}
      alt="sticker"
      width={sticker.width}
      height={sticker.height}
    />
  );
}

export function StickerSelect({
  stickers,
  selectedStickerId,
  onEmojiChanged,
}: StickerSelectProps) {
  const selectedSticker = stickers.find(
    (sticker) => sticker.id === selectedStickerId
  );

  const [isOpen, setIsOpen] = useState(false);

  const [selectedListSticker, setSelectedListSticker] =
    useState(selectedStickerId);

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {selectedSticker ? (
          <StickerImage sticker={selectedSticker} />
        ) : (
          <p>?</p>
        )}
      </Button>
      {isOpen && (
        <ModalDialog
          title="Виберіть стікер"
          footer={
            <Button
              disabled={selectedListSticker === undefined}
              color="primary"
              onClick={() => {
                if (selectedListSticker !== undefined) {
                  onEmojiChanged?.(selectedListSticker);
                }

                setIsOpen(false);
              }}
            >
              Select
            </Button>
          }
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <ul className={styles.list}>
            {stickers.map((sticker) => (
              <li
                key={sticker.id}
                data-selected={sticker.id === selectedStickerId}
                onClick={() => {
                  setSelectedListSticker(sticker.id);
                }}
              >
                <StickerImage sticker={sticker} />
              </li>
            ))}
          </ul>
        </ModalDialog>
      )}
    </>
  );
}
