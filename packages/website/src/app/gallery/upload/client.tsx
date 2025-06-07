'use client';

import { MultipleInlineImageDropArea } from '@/components/MultipleInlineImageDropArea';
import styles from './page.module.scss';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { LinkIcon } from '@/icons/LinkIcon';
import { DatePicker } from '@/components/DatePicker';
import { uploadGalleryImages } from '@/api/gallery/client';
import { useNotification } from '@/components/Notification';
import { useRouter } from 'next/navigation';
import { SelectEventDialog } from '@/components/SelectEventDialog';
import { ShortEvent } from '@/api/events/types';
import { fetchAllEventsShort } from '@/api/events/client';
import { Typography } from '@/components/Typography';
import { useCheckUserRole } from '@/hooks/useCheckUserRole';
import { UserRole } from '@shared/api/user/types';

export function ClientComponent() {
  useCheckUserRole(UserRole.ADMIN);

  const [files, setFiles] = useState<File[]>([]);
  const [date, setDate] = useState<Date>(() => new Date());
  const [attachedEvent, setAttachedEvent] = useState<ShortEvent>();
  const [isSelectEventDialogShown, setIsSelectEventDialogShown] =
    useState(false);
  const [isActionPending, setActionPending] = useState(false);
  const [events, setEvents] = useState<ShortEvent[]>();

  const notification = useNotification();

  const router = useRouter();

  return (
    <div className={styles.content}>
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
                router.push('/gallery');

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
          onSelect={(event) => {
            setAttachedEvent(event);
          }}
          onClose={() => {
            setIsSelectEventDialogShown(false);
          }}
        />
      )}
    </div>
  );
}
