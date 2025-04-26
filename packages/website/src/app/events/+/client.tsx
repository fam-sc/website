'use client';

import { getMediaFileUrl } from '@/api/media';
import { Button } from '@/components/Button';
import { InlineImageDropArea } from '@/components/InlineImageDropArea';
import { RichTextEditor } from '@/components/RichTextEditor';
import { fileToDataUrl } from '@/utils/fileTransformations';
import { useRef, useState } from 'react';

import styles from './page.module.scss';
import { addEvent } from '@/api/events/client';
import { useRouter } from 'next/navigation';

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
  const imageFileRef = useRef<File>(undefined);
  const [description, setDescription] = useState(event?.description);

  const [actionPending, setActionPending] = useState(false);

  const router = useRouter();

  return (
    <>
      <InlineImageDropArea
        disabled={actionPending}
        className={styles.image}
        imageSrc={image}
        onFile={(file) => {
          imageFileRef.current = file;

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
        disabled={actionPending}
        className={styles.description}
        text={description ?? ''}
        onSaveText={(newText) => {
          setDescription(newText);

          return Promise.resolve(newText);
        }}
      />

      <Button
        className={styles['save-edit-button']}
        disabled={actionPending}
        buttonVariant="solid"
        onClick={() => {
          const { current: image } = imageFileRef;

          if (image !== undefined && description !== undefined) {
            setActionPending(true);

            addEvent({ image, description })
              .then(() => {
                router.push('/events');
              })
              .catch((error: unknown) => {
                console.error(error);

                setActionPending(false);
              });
          }
        }}
      >
        {event ? 'Зберегти' : 'Додати'}
      </Button>
    </>
  );
}
