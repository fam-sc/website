'use client';

import { useState } from 'react';
import {
  Button,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import Image from 'next/image';

import { Sticker } from '@/types/botFlow';

export type StickerSelectProps = {
  stickers: Sticker[];
  selectedStickerId?: string;
  onEmojiChanged?: (emoji: string) => void;
};

function StickerImage({ sticker }: { sticker: Sticker }) {
  return (
    <Image
      className="size-10"
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
    (sticker) => sticker.id === selectedStickerId,
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedListSticker, setSelectedListSticker] =
    useState(selectedStickerId);

  return (
    <>
      <Button onPress={onOpen}>
        {selectedSticker ? (
          <StickerImage sticker={selectedSticker} />
        ) : (
          <p>?</p>
        )}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select sticker
              </ModalHeader>
              <ModalBody>
                <Listbox
                  isVirtualized
                  virtualization={{
                    maxListboxHeight: 400,
                    itemHeight: 40,
                  }}
                  selectionMode="single"
                  variant="flat"
                  selectedKeys={
                    selectedListSticker ? [selectedListSticker] : undefined
                  }
                  onSelectionChange={(keys) => {
                    if (typeof keys !== 'string') {
                      const keysArray = [...keys];

                      setSelectedListSticker(keysArray[0] as string);
                    }
                  }}
                  items={stickers}
                >
                  {(sticker) => (
                    <ListboxItem key={sticker.id}>
                      <StickerImage sticker={sticker} />
                    </ListboxItem>
                  )}
                </Listbox>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={selectedListSticker === undefined}
                  color="primary"
                  onPress={() => {
                    if (selectedListSticker !== undefined) {
                      onEmojiChanged?.(selectedListSticker);
                    }

                    onClose();
                  }}
                >
                  Select
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
