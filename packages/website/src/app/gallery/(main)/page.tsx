import { PageProps } from '@/types/next';
import { ClientComponent } from './client';

export default function Page({ searchParams }: PageProps) {
  return <ClientComponent canUpload />;
}
