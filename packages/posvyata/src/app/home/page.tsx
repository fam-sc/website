import { useEffect } from 'react';

import { validateCampaignRequest } from '@/api/client';
import { registerCampaignRequest } from '@/campaign/handler';
import { CampaignReferrer, isValidCampaignReferrer } from '@/campaign/types';
import { CountdownBlock } from '@/components/blocks/CountdownBlock';
import { FooterBlock } from '@/components/blocks/FooterBlock';
import { ImagesBlock } from '@/components/blocks/ImagesBlock';
import { MapBlock } from '@/components/blocks/MapBlock';
import { MathBlock } from '@/components/blocks/MathBlock';
import { PlotBlock } from '@/components/blocks/PlotBlock';
import { VSCodeBlock } from '@/components/blocks/VSCodeBlock';

import { Route } from './+types/page';
import styles from './page.module.scss';

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const rawReferrer = searchParams.get('ref');
  let referrer = CampaignReferrer.NONE;

  if (rawReferrer !== null) {
    const rawRef = Number.parseInt(rawReferrer);

    if (isValidCampaignReferrer(rawRef)) {
      referrer = rawRef;
    }
  }

  const userAgent = request.headers.get('User-Agent');
  let requestId: string | undefined;

  try {
    requestId = await registerCampaignRequest(
      context.cloudflare.env,
      referrer,
      userAgent
    );
  } catch (error) {
    console.error(error);
  }

  return new Response(null, {
    headers: {
      'Set-Cookie': `rid=${requestId}`,
    },
  });
}

export default function Page() {
  useEffect(() => {
    const { search } = window.location;

    void validateCampaignRequest();

    if (search.length > 0) {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  return (
    <div className={styles.content}>
      <CountdownBlock />
      <MathBlock />
      <VSCodeBlock />
      <ImagesBlock />
      <PlotBlock />
      <MapBlock />
      <FooterBlock />
    </div>
  );
}
