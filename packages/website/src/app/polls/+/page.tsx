import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { addPoll } from '@/api/polls/client';
import type { AddPollPayload } from '@/api/polls/types';
import { Button } from '@/components/Button';
import { useNotification } from '@/components/Notification';
import { PollBuilder } from '@/components/PollBuilder';
import { TextInput } from '@/components/TextInput';
import { isValidItem, QuestionBuildItem } from '@/services/polls/buildItem';

import styles from './page.module.scss';

export default function Page() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<QuestionBuildItem[]>([]);
  const [isActionPending, setIsActionPending] = useState(false);

  const notification = useNotification();
  const navigate = useNavigate();

  const isPollValid =
    items.length > 0 && items.every((item) => isValidItem(item));

  const submit = useCallback(() => {
    setIsActionPending(true);

    const questions = items.map(({ title, descriptor }) => ({
      title,
      ...descriptor,
    })) as AddPollPayload['questions'];

    addPoll({ title, questions })
      .then(() => {
        void navigate('/polls');

        notification.show('Опитування додано успішно', 'plain');
      })
      .catch(() => {
        setIsActionPending(false);

        notification.show('Сталася помилка', 'error');
      });
  }, [items, navigate, notification, title]);

  return (
    <div className={styles.content}>
      <TextInput
        disabled={isActionPending}
        className={styles.title}
        placeholder="Заголовок"
        value={title}
        onTextChanged={setTitle}
      />

      <PollBuilder
        disabled={isActionPending}
        className={styles['poll-builder']}
        items={items}
        onItemsChanged={setItems}
      />

      <Button
        buttonVariant="solid"
        className={styles.add}
        disabled={!(isPollValid && title.length > 0) || isActionPending}
        onClick={submit}
      >
        Додати
      </Button>
    </div>
  );
}
