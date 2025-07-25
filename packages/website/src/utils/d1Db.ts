import { getEnvChecked } from '@sc-fam/shared';
import { ApiD1Database } from '@sc-fam/shared/cloudflare';

export function getDatabase(): D1Database {
  const token = getEnvChecked('CF_D1_TOKEN');
  const accountId = getEnvChecked('CF_D1_ACCOUNT_ID');
  const dbId = getEnvChecked('CF_D1_ID');

  return new ApiD1Database(token, accountId, dbId);
}
