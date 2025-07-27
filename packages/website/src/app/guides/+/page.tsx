import { Repository } from '@sc-fam/data';
import { parseInt } from '@sc-fam/shared';
import { richTextToHtml } from '@sc-fam/shared/richText';
import { useCallback, useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router';

import { addGuide, editGuide } from '@/api/guides/client';
import { Button } from '@/components/Button';
import { ErrorBoard } from '@/components/ErrorBoard';
import { InlineImageDropArea } from '@/components/InlineImageDropArea';
import { Labeled } from '@/components/Labeled';
import { useNotification } from '@/components/Notification';
import { RichTextEditor, RichTextEditorRef } from '@/components/RichTextEditor';
import { TextInput } from '@/components/TextInput';
import { Title } from '@/components/Title';
import { useSelectableImage } from '@/hooks/useSelectableImage';
import { sizesToImages } from '@/utils/image/transform';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';

async function getClientGuide(repo: Repository, id: number) {
  try {
    const editGuide = await repo.guides().findById(id);

    return editGuide
      ? {
          id,
          title: editGuide.title,
          images: editGuide.images,
          description: richTextToHtml(editGuide.description, {
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
  const editGuideId = parseInt(searchParams.get('edit'));

  const repo = repository(context);
  const guide =
    editGuideId !== undefined
      ? await getClientGuide(repo, editGuideId)
      : undefined;

  if (guide === undefined && editGuideId !== undefined) {
    return redirect('/guides/+');
  }

  return { guide };
}

export default function Page({ loaderData: { guide } }: Route.ComponentProps) {
  const errorAlert = useNotification();

  const [image, setImage] = useSelectableImage(
    () => guide && sizesToImages(`guides/${guide.id}`, guide.images)
  );
  const imageFileRef = useRef<File>(undefined);

  const [title, setTitle] = useState(guide?.title ?? '');
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(
    guide === undefined
  );
  const descriptionRef = useRef<RichTextEditorRef | null>(null);

  const [actionPending, setActionPending] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <Title>
        {guide !== undefined ? 'Редагування події' : 'Додати подію'}
      </Title>

      <TextInput
        disabled={actionPending}
        error={title.length === 0 ? 'Пустий заголовок' : undefined}
        className={styles.title}
        placeholder="Заголовок"
        value={title}
        onTextChanged={setTitle}
      />

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

      <Labeled title="Опис">
        <RichTextEditor
          ref={descriptionRef}
          disabled={actionPending}
          className={styles.description}
          text={guide?.description ?? ''}
          onIsEmptyChanged={setIsDescriptionEmpty}
        />
      </Labeled>

      <ErrorBoard
        className={styles.errors}
        items={[
          title.length === 0 && 'Пустий заголовок',
          isDescriptionEmpty && 'Пустий опис',
          image === undefined && 'Немає картинки',
        ]}
      />

      <Button
        className={styles['save-edit-button']}
        disabled={
          actionPending ||
          title.length === 0 ||
          isDescriptionEmpty ||
          image === undefined
        }
        buttonVariant="solid"
        onClick={() => {
          const { current: image } = imageFileRef;

          setActionPending(true);

          let promise: Promise<void> | undefined;

          const description = descriptionRef.current?.getRichText();
          if (!description) {
            throw new Error('Description is null');
          }

          if (guide === undefined) {
            if (image !== undefined) {
              promise = addGuide({
                title,
                image,
                description: description.value,
                descriptionFiles: description.files,
              });
            }
          } else {
            promise = editGuide(guide.id, {
              title,
              image,
              description: description.value,
              descriptionFiles: description.files,
            });
          }

          if (promise) {
            promise
              .then(() => {
                return navigate('/guides');
              })
              .catch((error: unknown) => {
                console.error(error);

                errorAlert.show('Сталася помилка при збережені даних', 'error');
                setActionPending(false);
              });
          }
        }}
      >
        {guide ? 'Зберегти' : 'Додати'}
      </Button>
    </div>
  );
}
