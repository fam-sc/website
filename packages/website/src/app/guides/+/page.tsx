import { Repository } from '@sc-fam/data';
import { parseInt } from '@sc-fam/shared';
import { richTextToHtml } from '@sc-fam/shared/richText';
import { useNotification } from '@sc-fam/shared-ui';
import { useCallback, useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router';

import { addGuide, editGuide } from '@/api/guides/client';
import { AddGuidePayload } from '@/api/guides/types';
import { Button } from '@/components/Button';
import { ErrorBoard } from '@/components/ErrorBoard';
import { InlineImageDropArea } from '@/components/InlineImageDropArea';
import { Labeled } from '@/components/Labeled';
import { LazyRichTextEditor } from '@/components/LazyRichTextEditor';
import { NoIndex } from '@/components/NoIndex';
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

async function getClientGuide(repo: Repository, id: number) {
  try {
    const editGuide = await repo.guides().findById(id);

    return editGuide
      ? {
          id,
          slug: editGuide.slug,
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

  const [image, setImage] = useSelectableImage(() =>
    guide && guide.images
      ? imageDataToClientImages(`guides/${guide.id}`, guide.images)
      : undefined
  );
  const imageFileRef = useRef<File>(undefined);

  const [title, setTitle] = useState(guide?.title ?? '');
  const [slug, setSlug] = useState(guide?.slug ?? '');
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(
    guide === undefined
  );
  const descriptionRef = useRef<RichTextEditorRef | null>(null);

  const validation = useValidation({
    title: [title.length > 0, 'Пустий заголовок'],
    slug: [slug.length > 0, 'Пустий користуватський ID'],
    description: [!isDescriptionEmpty, 'Пустий опис'],
  });

  const [actionPending, setActionPending] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <NoIndex />

      <Title>
        {guide !== undefined ? 'Редагування події' : 'Додати подію'}
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
          autoUpdateSlug={guide === undefined}
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

      <Labeled title="Опис">
        <LazyRichTextEditor
          ref={descriptionRef}
          disabled={actionPending}
          className={styles.description}
          text={guide?.description ?? ''}
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

          const description = descriptionRef.current?.getRichText();
          if (!description) {
            throw new Error('Description is null');
          }

          const payload: AddGuidePayload = {
            title,
            image,
            slug,
            description: description.value,
            descriptionFiles: description.files,
          };

          const promise =
            guide === undefined
              ? addGuide(payload)
              : editGuide(guide.id, payload);

          promise
            .then(() => {
              return navigate('/guides');
            })
            .catch((error: unknown) => {
              console.error(error);

              errorAlert.show('Сталася помилка при збережені даних', 'error');
              setActionPending(false);
            });
        }}
      >
        {guide ? 'Зберегти' : 'Додати'}
      </Button>
    </div>
  );
}
