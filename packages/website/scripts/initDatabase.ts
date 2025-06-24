import { loadEnvFile } from 'node:process';
import { ApiD1Database } from '@shared/cloudflare/d1/api';
import { getEnvChecked } from '@shared/env';
import { Repository } from '@data/repo';

async function main() {
  loadEnvFile('.env.local');
  const token = getEnvChecked('CF_D1_TOKEN');
  const accountId = getEnvChecked('CF_D1_ACCOUNT_ID');
  const dbId = getEnvChecked('CF_D1_ID');

  const database = new ApiD1Database(token, accountId, dbId);

  await Repository.init(database);
}

void main();
