import { PageProps } from '@/types/next';
import { ClientComponent } from './client';

export default async function Page({ searchParams }: PageProps) {
  const { id: rawId } = await searchParams;
  const id = typeof rawId === 'string' ? rawId : null;

  return <ClientComponent canModify selectedId={id} />;
}
