import { Poll } from '@/api/polls/types';
import { PageProps } from '@/types/next';
import { Repository } from '@data/repo';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import { ClientComponent } from './client';

async function findPollById(id: string): Promise<Poll | null> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  await using repo = await Repository.openConnection();

  return await repo.polls().findById(objectId);
}

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const poll = await findPollById(id);
  if (poll === null) {
    notFound();
  }

  return <ClientComponent poll={{ ...poll, id }} />;
}
