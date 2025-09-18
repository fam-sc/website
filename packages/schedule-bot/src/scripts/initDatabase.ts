import { getEnvChecked } from '@sc-fam/shared';
import { ApiD1Database } from '@sc-fam/shared/cloudflare';
import { setDefaultDatabase } from '@sc-fam/shared-sql/repo';
import { config } from 'dotenv';

import { botRepository } from '@/data/repo';

async function main() {
  config({ path: '.env.local', quiet: true });

  const token = getEnvChecked('CF_D1_TOKEN');
  const accountId = getEnvChecked('CF_D1_ACCOUNT_ID');
  const dbId = getEnvChecked('CF_D1_ID');

  setDefaultDatabase(new ApiD1Database(token, accountId, dbId));
  await botRepository.init();
}

void main();
