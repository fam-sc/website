import { getMediaFileUrl } from '@shared/api/media';
import { Button } from '@/components/Button';
import { InlineImageDropArea } from '@/components/InlineImageDropArea';
import { RichTextEditor, RichTextEditorRef } from '@/components/RichTextEditor';
import { useRef, useState } from 'react';

import styles from './page.module.scss';
import { addEvent, editEvent } from '@/api/events/client';
import { TextInput } from '@/components/TextInput';
import { DatePicker } from '@/components/DatePicker';
import { ErrorBoard } from '@/components/ErrorBoard';
import { useNotification } from '@/components/Notification';
import { OptionSwitch } from '@/components/OptionSwitch';
import { Labeled } from '@/components/Labeled';
import { useCheckUserRole } from '@/hooks/useCheckUserRole';
import { UserRole } from '@shared/api/user/types';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import { EventStatus } from '@shared/api/events/types';
import { useNavigate } from 'react-router';
import { Title } from '@/components/Title';

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
  useCheckUserRole(UserRole.ADMIN);

  const errorAlert = useNotification();

  const [image, setImage] = useObjectUrl(
    event && getMediaFileUrl(`events/${event.id}`)
  );
  const imageFileRef = useRef<File>(undefined);

  const [title, setTitle] = useState(event?.title ?? '');
  const [date, setDate] = useState(event?.date ?? new Date());
  const [status, setStatus] = useState<EventStatus>('pending');
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(
    event === undefined
  );
  const descriptionRef = useRef<RichTextEditorRef | null>(null);

  const [actionPending, setActionPending] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <Title>
        {event !== undefined ? 'Редагування події' : 'Додати подію'}
      </Title>

      <TextInput
        disabled={actionPending}
        error={title.length === 0 ? 'Пустий заголовок' : undefined}
        className={styles.title}
        placeholder="Заголовок"
        value={title}
        onTextChanged={setTitle}
      />

      <Labeled title="Картинка">
        <InlineImageDropArea
          disabled={actionPending}
          className={styles.image}
          imageSrc={image}
          onFile={(file) => {
            imageFileRef.current = file;

            setImage(
              file && { url: URL.createObjectURL(file), type: 'object' }
            );
          }}
        />
      </Labeled>

      <Labeled title="Дата">
        <DatePicker
          disabled={actionPending}
          className={styles.date}
          value={date}
          onValueChanged={setDate}
        />
      </Labeled>

      <Labeled title="Статус">
        <OptionSwitch
          options={['pending', 'ended']}
          selected={status}
          renderOption={(status) =>
            status === 'pending' ? 'Очікується' : 'Закінчилась'
          }
          onOptionSelected={setStatus}
        />
      </Labeled>

      <Labeled title="Опис">
        <RichTextEditor
          ref={descriptionRef}
          disabled={actionPending}
          className={styles.description}
          text={event?.description ?? ''}
          onIsEmptyChanged={setIsDescriptionEmpty}
        />
      </Labeled>

      <ErrorBoard
        className={styles.errors}
        items={[
          title.length === 0 && 'Пустий заголовок',
          isDescriptionEmpty && 'Пустий опис',
          image === undefined && 'Немає картинки',
        ]}
      />

      <Button
        className={styles['save-edit-button']}
        disabled={
          actionPending ||
          title.length === 0 ||
          isDescriptionEmpty ||
          image === undefined
        }
        buttonVariant="solid"
        onClick={() => {
          const { current: image } = imageFileRef;

          setActionPending(true);

          let promise: Promise<void> | undefined;

          const description = descriptionRef.current?.getHTMLText() ?? '';

          if (event === undefined) {
            if (image !== undefined) {
              promise = addEvent({ title, date, image, description, status });
            }
          } else {
            promise = editEvent(event.id, {
              title,
              date,
              image,
              description,
              status,
            });
          }

          if (promise) {
            promise
              .then(() => {
                void navigate('/events');
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
