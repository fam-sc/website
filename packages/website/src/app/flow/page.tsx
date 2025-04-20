import { ClientComponent } from './client';

import { getBotFlow } from '@/api/botFlow';

export default async function FlowPage() {
  const flow = await getBotFlow();

  return <ClientComponent flow={flow} />;
}
