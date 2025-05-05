import { ModalDialog } from '../ModalDialog';
import { Button } from '../Button';

import styles from './index.module.scss';
import { Typography } from '../Typography';
import { useState } from 'react';
import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';

export type EventWithId = {
  id: string;
  title: string;
};

export type SelectEventDialogProps = {
  // undefined means that events are loading.
  events: EventWithId[] | undefined;

  selectedEvent?: EventWithId;

  onClose: () => void;
  onSelect: (event: EventWithId) => void;
};

export function SelectEventDialog({
  selectedEvent,
  events,
  onClose,
  onSelect,
}: SelectEventDialogProps) {
  const [selected, setSelected] = useState<EventWithId | undefined>(
    selectedEvent
  );

  return (
    <ModalDialog
      onClose={onClose}
      contentClassName={styles.content}
      title="Події"
      footer={
        <Button
          buttonVariant="solid"
          disabled={selected === undefined}
          onClick={() => {
            if (selected !== undefined) {
              onSelect(selected);
              onClose();
            }
          }}
        >
          Вибрати
        </Button>
      }
    >
      {events === undefined ? (
        <IndeterminateCircularProgress
          className={styles['loading-indicator']}
        />
      ) : (
        <ul className={styles.list}>
          {events.map((event) => (
            <Typography
              as="li"
              key={event.id}
              data-selected={event === selected}
              onClick={() => {
                setSelected(event);
              }}
            >
              {event.title}
            </Typography>
          ))}
        </ul>
      )}
    </ModalDialog>
  );
}
