import { Metadata } from 'next';
import { ClientComponent } from './client';

export const metadata: Metadata = {
  title: 'Зміна ролей',
};

export default function Page() {
  return <ClientComponent />;
}
