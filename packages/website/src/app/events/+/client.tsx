'use client';

import { getMediaFileUrl } from '@/api/media';
import { Button } from '@/components/Button';
import { InlineImageDropArea } from '@/components/InlineImageDropArea';
import { RichTextEditor } from '@/components/RichTextEditor';
import { fileToDataUrl } from '@/utils/fileTransformations';
import { useRef, useState } from 'react';

import styles from './page.module.scss';
import { addEvent, editEvent } from '@/api/events/client';
// import { useRouter } from 'next/navigation';
import { TextInput } from '@/components/TextInput';
import { DatePicker } from '@/components/DatePicker';
import { ErrorBoard } from '@/components/ErrorBoard';
import { useNotification } from '@/components/Notification';

export type ClientEvent = {
  id: string;
  title: string;
  date: Date;
  description: string;
};

export type ClientComponentProps = {
  event: ClientEvent | undefined;
};

export function ClientComponent({ event }: ClientComponentProps) {
  const errorAlert = useNotification();

  const [image, setImage] = useState(
    event && getMediaFileUrl(`events/${event.id}`)
  );
  const imageFileRef = useRef<File>(undefined);

  const [title, setTitle] = useState(event?.title ?? '');
  const [date, setDate] = useState(event?.date ?? new Date());
  const [description, setDescription] = useState(event?.description ?? '');
  const [isDescriptionSaved, setIsDescriptionSaved] = useState(true);

  const [actionPending, setActionPending] = useState(false);

  // const router = useRouter();

  return (
    <div className={styles.root}>
      <TextInput
        disabled={actionPending}
        error={title.length === 0 ? 'Пустий заголовок' : undefined}
        className={styles.title}
        placeholder="Заголовок"
        value={title}
        onTextChanged={(text) => {
          setTitle(text);
        }}
      />

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

                errorAlert.show('Сталася помилка', 'error');
              });
          }
        }}
      />

      <DatePicker
        disabled={actionPending}
        className={styles.date}
        value={date}
        onValueChanged={(value) => {
          setDate(value);
        }}
      />

      <RichTextEditor
        disabled={actionPending}
        className={styles.description}
        text={description}
        onSaveText={(newText) => {
          setDescription(newText);

          return Promise.resolve(newText);
        }}
        onIsSavedChanged={(value) => {
          setIsDescriptionSaved(!value);
        }}
      />

      <ErrorBoard
        className={styles.errors}
        items={[
          title.length === 0 && 'Пустий заголовок',
          description.length === 0 && 'Пустий опис',
          !isDescriptionSaved && 'Не збережений опис',
          image === undefined && 'Немає картинки',
        ]}
      />

      <Button
        className={styles['save-edit-button']}
        disabled={
          actionPending ||
          title.length === 0 ||
          description.length === 0 ||
          !isDescriptionSaved ||
          image === undefined
        }
        buttonVariant="solid"
        onClick={() => {
          const { current: image } = imageFileRef;

          setActionPending(true);

          let promise: Promise<void> | undefined;

          if (event === undefined) {
            if (image !== undefined) {
              promise = addEvent({ title, date, image, description });
            }
          } else {
            promise = editEvent(event.id, { title, date, image, description });
          }

          if (promise) {
            promise
              .then(() => {
                // router.push('/events');
              })
              .catch((error: unknown) => {
                console.error(error);

                errorAlert.show('Сталася помилка при збережені даних', 'error');
                setActionPending(false);
              });
          }
        }}
      >
        {event ? 'Зберегти' : 'Додати'}
      </Button>
    </div>
  );
}
