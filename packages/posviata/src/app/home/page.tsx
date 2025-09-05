import { useEffect } from 'react';

import { validateCampaignRequest } from '@/api/client';
import { registerCampaignRequest } from '@/campaign/handler';
import { CampaignReferrer, isValidCampaignReferrer } from '@/campaign/types';
import { CountdownBlock } from '@/components/blocks/CountdownBlock';
import { ImagesBlock } from '@/components/blocks/ImagesBlock';
import { InfoBlock } from '@/components/blocks/InfoBlock';
import { MapBlock } from '@/components/blocks/MapBlock';
import { MathBlock } from '@/components/blocks/MathBlock';
import { MerchBlock } from '@/components/blocks/MerchBlock';
import { PastBlock } from '@/components/blocks/PastBlock';
import { QuestionBlock } from '@/components/blocks/QuestionBlock';
import { RegistrationBlock } from '@/components/blocks/RegistrationBlock';
import { VSCodeBlock } from '@/components/blocks/VSCodeBlock';
import { Footer } from '@/components/Footer';
import { Title } from '@/components/Title';

import { Route } from './+types/page';
import styles from './page.module.scss';

export async function loader({ request }: Route.LoaderArgs) {
  let requestId: string | undefined;

  if (!import.meta.env.DEV) {
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

    try {
      requestId = await registerCampaignRequest(referrer, userAgent);
    } catch (error) {
      console.error(error);
    }
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
      <Title>ПОСВЯТА 2025</Title>
      <meta name="description" content="ПОСВЯТА 2025" />

      <CountdownBlock />
      <MathBlock />
      <ImagesBlock />
      <VSCodeBlock />
      <PastBlock />
      <MerchBlock />
      <InfoBlock />
      <MapBlock />
      {/* <ScheduleBlock /> */}
      <RegistrationBlock />
      <QuestionBlock />
      <Footer />
    </div>
  );
}
