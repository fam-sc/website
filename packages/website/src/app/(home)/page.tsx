import { Metadata } from 'next';

import { ClientComponent } from './client-component';

export const metadata: Metadata = {
  title: 'Головна',
};

export default function HomePage() {
  return <ClientComponent />;
}
