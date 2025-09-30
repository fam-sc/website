import { EventStatus, Repository } from '@sc-fam/data';
import { parseInt } from '@sc-fam/shared';
import { richTextToHtml } from '@sc-fam/shared/richText';
import { useNotification } from '@sc-fam/shared-ui';
import { useCallback, useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router';

import { addEvent, editEvent } from '@/api/events/client';
import { AddEventPayload } from '@/api/events/types';
import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { ErrorBoard } from '@/components/ErrorBoard';
import { InlineImageDropArea } from '@/components/InlineImageDropArea';
import { Labeled } from '@/components/Labeled';
import { LazyRichTextEditor } from '@/components/LazyRichTextEditor';
import { NoIndex } from '@/components/NoIndex';
import { OptionSwitch } from '@/components/OptionSwitch';
import type { RichTextEditorRef } from '@/components/RichTextEditor';
import { SlugInput } from '@/components/SlugInput';
import { TextInput } from '@/components/TextInput';
import { Title } from '@/components/Title';
import { useSelectableImage } from '@/hooks/useSelectableImage';
import {
  getValidationItem,
  testValidationResult,
  useValidation,
} from '@/hooks/useValidation';
import { imageDataToClientImages } from '@/utils/image/transform';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';

async function getClientEvent(repo: Repository, id: number) {
  try {
    const editEvent = await repo.events().findById(id);

    return editEvent
      ? {
          id,
          title: editEvent.title,
          date: editEvent.date,
          images: editEvent.images,
          slug: editEvent.slug,
          description: richTextToHtml(editEvent.description, {
            mediaUrl: import.meta.env.VITE_MEDIA_URL,
          }),
        }
      : undefined;
  } catch {
    return undefined;
  }
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const editEventId = parseInt(searchParams.get('edit'));

  const repo = repository(context);
  const event =
    editEventId !== undefined
      ? await getClientEvent(repo, editEventId)
      : undefined;

  if (event === undefined && editEventId !== undefined) {
    return redirect('/events/+');
  }

  return { event };
}

export default function Page({ loaderData: { event } }: Route.ComponentProps) {
  const errorAlert = useNotification();

  const [image, setImage] = useSelectableImage(
    () => event && imageDataToClientImages(`events/${event.id}`, event.images)
  );
  const imageFileRef = useRef<File>(undefined);

  const [title, setTitle] = useState(event?.title ?? '');
  const [slug, setSlug] = useState(event?.slug ?? '');
  const [date, setDate] = useState(event ? new Date(event.date) : new Date());
  const [status, setStatus] = useState(EventStatus.PENDING);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(
    event === undefined
  );
  const descriptionRef = useRef<RichTextEditorRef | null>(null);

  const validation = useValidation({
    title: [title.length > 0, 'Пустий заголовок'],
    slug: [slug.length > 0, 'Пустий користуватський ID'],
    description: [!isDescriptionEmpty, 'Пустий опис'],
    image: [image !== undefined, 'Немає картинки'],
  });

  const [actionPending, setActionPending] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <NoIndex />

      <Title>
        {event !== undefined ? 'Редагування події' : 'Додати подію'}
      </Title>

      <TextInput
        disabled={actionPending}
        error={getValidationItem(validation, 'title')}
        className={styles.title}
        placeholder="Заголовок"
        value={title}
        onTextChanged={setTitle}
      />

      <Labeled title="Користуватський ID">
        <SlugInput
          disabled={actionPending}
          error={getValidationItem(validation, 'slug')}
          slug={slug}
          slugContent={title}
          onSlugChanged={setSlug}
          autoUpdateSlug={event === undefined}
        />
      </Labeled>

      <Labeled title="Картинка">
        <InlineImageDropArea
          disabled={actionPending}
          className={styles.image}
          image={image}
          onFile={useCallback(
            (file) => {
              imageFileRef.current = file;

              setImage(file);
            },
            [setImage]
          )}
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
          options={[EventStatus.PENDING, EventStatus.ENDED]}
          selected={status}
          renderOption={useCallback(
            (status: EventStatus) =>
              status === EventStatus.PENDING ? 'Очікується' : 'Закінчилась',
            []
          )}
          onOptionSelected={setStatus}
        />
      </Labeled>

      <Labeled title="Опис">
        <LazyRichTextEditor
          ref={descriptionRef}
          disabled={actionPending}
          className={styles.description}
          text={event?.description ?? ''}
          onIsEmptyChanged={setIsDescriptionEmpty}
        />
      </Labeled>

      <ErrorBoard className={styles.errors} items={validation} />

      <Button
        className={styles['save-edit-button']}
        disabled={actionPending || testValidationResult(validation)}
        buttonVariant="solid"
        onClick={() => {
          const { current: image } = imageFileRef;

          setActionPending(true);

          let promise: Promise<void> | undefined;

          const description = descriptionRef.current?.getRichText();
          if (!description) {
            throw new Error('Description is null');
          }

          const payload = {
            title,
            slug,
            date,
            image,
            status,
            description: description.value,
            descriptionFiles: description.files,
          };

          if (event === undefined) {
            if (image !== undefined) {
              promise = addEvent(payload as AddEventPayload);
            }
          } else {
            promise = editEvent(event.id, payload);
          }

          if (promise) {
            promise
              .then(() => {
                return navigate('/events');
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
