import { useEffect } from 'react';

import { validateCampaignRequest } from '@/api/client';
import { registerCampaignRequest } from '@/campaign/handler';
import { isValidCampaignReferrer } from '@/campaign/types';
import { CountdownBlock } from '@/components/blocks/CountdownBlock';
import { ImagesBlock } from '@/components/blocks/ImagesBlock';
import { MathBlock } from '@/components/blocks/MathBlock';
import { PlotBlock } from '@/components/blocks/PlotBlock';
import { VSCodeBlock } from '@/components/blocks/VSCodeBlock';

import { Route } from './+types/page';
import styles from './page.module.scss';

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const rawReferrer = searchParams.get('ref');
  let requestId: string | undefined;

  if (rawReferrer !== null) {
    const referrer = Number.parseInt(rawReferrer);

    if (isValidCampaignReferrer(referrer)) {
      const userAgent = request.headers.get('User-Agent');

      requestId = await registerCampaignRequest(
        context.cloudflare.env,
        referrer,
        userAgent
      );
    }
  }

  return { requestId };
}

export default function Page({
  loaderData: { requestId },
}: Route.ComponentProps) {
  useEffect(() => {
    if (requestId !== undefined) {
      void validateCampaignRequest(requestId);

      window.history.replaceState(null, '', '/');
    }
  }, [requestId]);

  return (
    <div className={styles.content}>
      <CountdownBlock />
      <MathBlock />
      <VSCodeBlock />
      <ImagesBlock />
      <PlotBlock />
    </div>
  );
}
