import { ScheduleBotOptions } from '@sc-fam/data';
import { useNotification } from '@sc-fam/shared-ui';
import { useCallback, useState } from 'react';

import { updateScheduleBotOptions } from '@/api/users/client';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Labeled } from '@/components/Labeled';
import { Switch } from '@/components/Switch';
import { TimePicker } from '@/components/TimePicker';
import { parseTimeString, secondsToTime } from '@/utils/time';

import styles from './ScheduleBotForm.module.scss';

export interface ScheduleBotFormProps {
  initial: ScheduleBotOptions | null;
}

interface TimeSelectorProps {
  disabled: boolean;
  title: string;
  time: number | null;
  onTimeSelected: (time: number | null) => void;
}

function TimeSelector({
  disabled,
  title,
  time,
  onTimeSelected,
}: TimeSelectorProps) {
  const onCheckedChanged = useCallback(
    (value: boolean) => {
      onTimeSelected(value ? 0 : null);
    },
    [onTimeSelected]
  );

  return (
    <Labeled title={title}>
      <Checkbox
        checked={time !== null}
        onCheckedChanged={onCheckedChanged}
        disabled={disabled}
      >
        Увімкнено
      </Checkbox>

      {time !== null && (
        <TimePicker
          time={secondsToTime(time)}
          onTimeChanged={(value) => onTimeSelected(parseTimeString(value))}
          className={styles['time-selector']}
          disabled={disabled}
        />
      )}
    </Labeled>
  );
}

export function ScheduleBotForm({ initial }: ScheduleBotFormProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(
    initial?.notificationEnabled ?? true
  );
  const [startTime, setStartTime] = useState(initial?.startTime ?? null);
  const [endTime, setEndTime] = useState(initial?.startTime ?? null);

  const [actionInProgress, setActionInProgress] = useState(false);

  const notification = useNotification();

  const onSave = useCallback(() => {
    setActionInProgress(true);

    updateScheduleBotOptions({ notificationEnabled, startTime, endTime })
      .then(() => {
        setActionInProgress(false);

        notification.show('Налаштування збережені', 'plain');
      })
      .catch(() => {
        setActionInProgress(false);

        notification.show('Не вдалося зберегти налаштування', 'plain');
      });
  }, [notificationEnabled, startTime, endTime, notification]);

  return (
    <div className={styles.root}>
      <Switch
        checked={notificationEnabled}
        onCheckedChanged={setNotificationEnabled}
        disabled={actionInProgress}
      >
        Надсилати сповіщення
      </Switch>

      <TimeSelector
        title="Надсилати сповіщення починаючи з"
        time={startTime}
        onTimeSelected={setStartTime}
        disabled={!notificationEnabled || actionInProgress}
      />

      <TimeSelector
        title="Закінчити надсилати сповіщення з"
        time={endTime}
        onTimeSelected={setEndTime}
        disabled={!notificationEnabled || actionInProgress}
      />

      <Button
        onClick={onSave}
        buttonVariant="solid"
        className={styles.save}
        disabled={actionInProgress}
      >
        Зберегти
      </Button>
    </div>
  );
}
