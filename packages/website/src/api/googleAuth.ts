import { TwoLeggedOptions } from '@sc-fam/shared/api/google';
import { importPKCS8 } from 'jose/key/import';

export async function getServiceAccountAuthOptions(
  env: Env,
  scope: string
): Promise<TwoLeggedOptions> {
  const key = await importPKCS8(env.GOOGLE_SA_KEY, 'RS256');

  return {
    key,
    scope,
    keyId: env.GOOGLE_SA_KEY_ID,
    serviceAccount: env.GOOGLE_SA_ACCOUNT,
  };
}
