import { Metadata } from 'next';
import { ClientComponent } from './client';

export const metadata: Metadata = {
  title: 'Завантаження фото',
};

export default function Page() {
  return <ClientComponent />;
}
