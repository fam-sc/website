import { Repository } from '@data/repo';
import { ClientComponent } from './client';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/next';
import { omitProperty } from '@/utils/object/omit';
import { Metadata } from 'next';
import { cache } from 'react';
import { shortenByWord } from '@shared/shortenByWord';
import { richTextToPlainText } from '@shared/richText/plainTransform';
import { getMediaFileUrl } from '@shared/media';

const getEvent = cache(async (id: string) => {
  await using repo = await Repository.openConnection();

  return await repo.events().findById(id);
});

export async function generateMetadata({
  params,
}: PageProps<{ id: string }>): Promise<Metadata> {
  const { id } = await params;

  const event = await getEvent(id);
  if (event === null) {
    return {};
  }

  const description = shortenByWord(
    richTextToPlainText(event.description),
    200
  );

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      images: getMediaFileUrl(`events/${id}`),
    },
  };
}

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const event = await getEvent(id);

  if (event === null) {
    notFound();
  }

  return (
    <ClientComponent
      event={{
        ...omitProperty(event, '_id'),
        id: event._id.toString(),
      }}
    />
  );
}
