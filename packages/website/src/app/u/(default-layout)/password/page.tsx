import { Metadata } from 'next';
import { ClientComponent } from './client';

export const metadata: Metadata = {
  title: 'Зміна паролю',
};

export default function Page() {
  return <ClientComponent />;
}
