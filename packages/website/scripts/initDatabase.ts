import { Repository } from '@sc-fam/data';
import { getEnvChecked } from '@sc-fam/shared';
import { ApiD1Database } from '@sc-fam/shared/cloudflare';
import { config } from 'dotenv';

async function main() {
  config({ path: '.env.local', quiet: true });

  const token = getEnvChecked('CF_D1_TOKEN');
  const accountId = getEnvChecked('CF_D1_ACCOUNT_ID');
  const dbId = getEnvChecked('CF_D1_ID');

  const database = new ApiD1Database(token, accountId, dbId);

  await Repository.init(database);
}

void main();
