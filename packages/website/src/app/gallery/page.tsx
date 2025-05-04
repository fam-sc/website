import { PageProps } from '@/types/next';
import { ClientComponent } from './client';
import { parseInt } from '@/utils/parseInt';

export default async function Page({ searchParams }: PageProps) {
  const { page: rawPage } = await searchParams;
  const page = parseInt(rawPage) ?? 1;

  return <ClientComponent page={page} />;
}
