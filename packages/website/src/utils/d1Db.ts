import { ApiD1Database } from '@shared/cloudflare/d1/api';
import { getEnvChecked } from '@shared/env';

export function getDatabase(): D1Database {
  const token = getEnvChecked('CF_D1_TOKEN');
  const accountId = getEnvChecked('CF_D1_ACCOUNT_ID');
  const dbId = getEnvChecked('CF_D1_ID');

  return new ApiD1Database(token, accountId, dbId);
}
