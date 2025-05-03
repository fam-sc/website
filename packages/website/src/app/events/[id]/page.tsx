import { Repository } from '@/data/repo';
import { BSONError } from 'bson';
import { ObjectId } from 'mongodb';
import { ClientComponent } from './client';
import { notFound } from 'next/navigation';

async function getEvent(id: string) {
  try {
    await using repo = await Repository.openConnection();

    return await repo.events().findById(new ObjectId(id));
  } catch (error: unknown) {
    if (BSONError.isBSONError(error)) {
      return null;
    }

    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (event === null) {
    notFound();
  }

  return (
    <ClientComponent
      event={{
        id: event._id.toString(),
        title: event.title,
        date: event.date,
        description: event.description,
      }}
    />
  );
}
