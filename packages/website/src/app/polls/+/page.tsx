import { PollBuilder } from '@/components/PollBuilder';
import styles from './page.module.scss';
import { useState } from 'react';
import {
  isValidItem,
  QuestionBuildItem,
} from '@/components/PollQuestionBuilder/item';
import { Button } from '@/components/Button';
import { useNotification } from '@/components/Notification';
import { addPoll } from '@/api/polls/client';
import { TextInput } from '@/components/TextInput';
import type { AddPollPayload } from '@/api/polls/types';
import { UserRole } from '@data/types/user';
import { useCheckUserRole } from '@/hooks/useCheckUserRole';
import { useNavigate } from 'react-router';

export default function Page() {
  useCheckUserRole(UserRole.ADMIN);

  const [title, setTitle] = useState('');
  const [items, setItems] = useState<QuestionBuildItem[]>([]);
  const [isActionPending, setIsActionPending] = useState(false);

  const notification = useNotification();
  const navigate = useNavigate();

  const isPollValid =
    items.length > 0 && items.every((item) => isValidItem(item));

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
        onClick={() => {
          setIsActionPending(true);

          const questions = items.map((item) => ({
            title: item.title,
            ...item.descriptor,
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
        }}
      >
        Додати
      </Button>
    </div>
  );
}
