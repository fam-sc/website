import { PageProps } from '@/types/next';
import { redirect } from 'next/navigation';
import { ClientComponent } from './client';

export default async function Page({ searchParams }: PageProps) {
  const { token: rawToken } = await searchParams;
  if (Array.isArray(rawToken)) {
    redirect('/');
  }

  return <ClientComponent token={rawToken} />;
}
