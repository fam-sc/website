import { useState } from 'react';

import { IndeterminateCircularProgress } from '../../../../shared-ui/src/components/IndeterminateCircularProgress';
import { Button } from '../Button';
import { ModalDialog } from '../ModalDialog';
import { SelectableList } from '../SelectableList';
import { Typography } from '../Typography';
import styles from './SelectEventDialog.module.scss';

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
        <IndeterminateCircularProgress />
      ) : (
        <SelectableList
          items={events}
          selectedItem={selected}
          className={styles.list}
          onSelect={setSelected}
        >
          {(event) => <Typography>{event.title}</Typography>}
        </SelectableList>
      )}
    </ModalDialog>
  );
}
