import { useNotification } from '@sc-fam/shared-ui';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { fetchAllEventsShort } from '@/api/events/client';
import { ShortEvent } from '@/api/events/types';
import { uploadGalleryImages } from '@/api/gallery/client';
import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { MultipleInlineImageDropArea } from '@/components/MultipleInlineImageDropArea';
import { NoIndex } from '@/components/NoIndex';
import { SelectEventDialog } from '@/components/SelectEventDialog';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';
import { LinkIcon } from '@/icons/LinkIcon';

import styles from './page.module.scss';

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [date, setDate] = useState<Date>(() => new Date());
  const [attachedEvent, setAttachedEvent] = useState<ShortEvent>();
  const [isSelectEventDialogShown, setIsSelectEventDialogShown] =
    useState(false);
  const [isActionPending, setActionPending] = useState(false);
  const [events, setEvents] = useState<ShortEvent[]>();

  const notification = useNotification();

  const navigate = useNavigate();

  const onDialogClose = useCallback(() => {
    setIsSelectEventDialogShown(false);
  }, []);

  return (
    <div className={styles.content}>
      <NoIndex />

      <Title>Завантаження фото</Title>

      <MultipleInlineImageDropArea
        disabled={isActionPending}
        className={styles.images}
        onFiles={setFiles}
      />

      <div className={styles['right-side']}>
        <div className={styles.options}>
          <DatePicker
            disabled={isActionPending}
            value={date}
            onValueChanged={setDate}
          />

          <div className={styles['attach-event']}>
            {attachedEvent && <Typography>{attachedEvent.title}</Typography>}

            <Button
              disabled={isActionPending}
              onClick={() => {
                if (events === undefined) {
                  fetchAllEventsShort()
                    .then((result) => {
                      setEvents(result);
                    })
                    .catch((error: unknown) => {
                      console.error(error);

                      notification.show('Сталася помилка', 'error');
                    });
                }

                setIsSelectEventDialogShown(true);
              }}
            >
              <LinkIcon />
              {attachedEvent === undefined
                ? "Прив'язати до події"
                : 'Змінити подію'}
            </Button>
          </div>
        </div>

        <Button
          buttonVariant="solid"
          disabled={files.length === 0 || isActionPending}
          onClick={() => {
            setActionPending(true);

            uploadGalleryImages({
              date,
              eventId: attachedEvent?.id ?? null,
              files,
            })
              .then(() => {
                void navigate('/gallery');

                notification.show('Фото були додані', 'plain');
              })
              .catch((error: unknown) => {
                console.error(error);

                notification.show('Не вдалось додати фото', 'error');
                setActionPending(false);
              });
          }}
        >
          Додати в галерею
        </Button>
      </div>

      {isSelectEventDialogShown && (
        <SelectEventDialog
          events={events}
          selectedEvent={attachedEvent}
          onSelect={setAttachedEvent}
          onClose={onDialogClose}
        />
      )}
    </div>
  );
}
