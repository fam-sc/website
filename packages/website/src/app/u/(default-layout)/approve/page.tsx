import { Metadata } from 'next';
import { ClientComponent } from './client';

export const metadata: Metadata = {
  title: 'Підтвердження користувачів',
};

export default function Page() {
  return <ClientComponent />;
}
