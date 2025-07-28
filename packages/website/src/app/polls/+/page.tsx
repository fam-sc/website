import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { addPoll } from '@/api/polls/client';
import type { AddPollPayload } from '@/api/polls/types';
import { Button } from '@/components/Button';
import { Labeled } from '@/components/Labeled';
import { useNotification } from '@/components/Notification';
import { PollBuilder } from '@/components/PollBuilder';
import { SlugInput } from '@/components/SlugInput';
import { TextInput } from '@/components/TextInput';
import { isValidItem, QuestionBuildItem } from '@/services/polls/buildItem';

import styles from './page.module.scss';

export default function Page() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
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

    addPoll({ title, slug, questions })
      .then(() => {
        notification.show('Опитування додано успішно', 'plain');

        return navigate('/polls');
      })
      .catch(() => {
        setIsActionPending(false);

        notification.show('Сталася помилка', 'error');
      });
  }, [items, slug, notification, title, navigate]);

  return (
    <div className={styles.content}>
      <Labeled title="Заголовок">
        <TextInput
          disabled={isActionPending}
          className={styles.title}
          placeholder="Заголовок"
          value={title}
          onTextChanged={setTitle}
        />
      </Labeled>

      <Labeled title="Користуватський ID">
        <SlugInput
          disabled={isActionPending}
          error={slug.length === 0 && 'Пустий користуватський ID'}
          slug={slug}
          slugContent={title}
          onSlugChanged={setSlug}
        />
      </Labeled>

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
