import { ModalDialog } from '../ModalDialog';
import { Button } from '../Button';

import styles from './index.module.scss';
import { Typography } from '../Typography';
import { useId, useState } from 'react';
import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import { List } from '../List';

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
  const globalId = useId();
  const [selected, setSelected] = useState<EventWithId | undefined>(
    selectedEvent
  );

  // TODO: Rewrite list as radio button group to enable native keyboard actions.
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
        <List
          className={styles.list}
          role="listbox"
          aria-label="Події"
          aria-activedescendant={
            selected ? `${globalId}-${selected.id}` : undefined
          }
          aria-multiselectable={false}
          aria-required
        >
          {events.map((event) => (
            <Typography
              as="li"
              id={`${globalId}-${event.id}`}
              key={event.id}
              role="option"
              aria-selected={event === selected}
              tabindex={0}
              onClick={() => {
                setSelected(event);
              }}
            >
              {event.title}
            </Typography>
          ))}
        </List>
      )}
    </ModalDialog>
  );
}
