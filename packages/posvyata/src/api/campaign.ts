import { validateCampaignRequest } from '@/campaign/handler';

export async function handleCampaignRequest(request: Request, env: Env) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get('id');

  if (requestId !== null) {
    await validateCampaignRequest(env, requestId);
  }

  return new Response();
}
