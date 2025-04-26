'use client';

import { getMediaFileUrl } from '@/api/media';
import { Button } from '@/components/Button';
import { InlineImageDropArea } from '@/components/InlineImageDropArea';
import { RichTextEditor } from '@/components/RichTextEditor';
import { fileToDataUrl } from '@/utils/fileTransformations';
import { useState } from 'react';

import styles from './page.module.scss';

export type ClientEvent = {
  id: string;
  date: Date;
  description: string;
};

export type ClientComponentProps = {
  event: ClientEvent | undefined;
};

export function ClientComponent({ event }: ClientComponentProps) {
  const [image, setImage] = useState(
    event && getMediaFileUrl(`events/${event.id}`)
  );
  const [description, setDescription] = useState(event?.description);

  return (
    <>
      <InlineImageDropArea
        className={styles.image}
        imageSrc={image}
        onFile={(file) => {
          if (file === undefined) {
            setImage(undefined);
          } else {
            fileToDataUrl(file)
              .then((url) => {
                setImage(url);
              })
              .catch((error: unknown) => {
                console.error(error);
              });
          }
        }}
      />

      <RichTextEditor
        className={styles.description}
        text={description ?? ''}
        onSaveText={(newText) => {
          setDescription(newText);

          return Promise.resolve(newText);
        }}
      />

      <Button className={styles['save-edit-button']} buttonVariant="solid">
        {event ? 'Зберігти' : 'Додати'}
      </Button>
    </>
  );
}
