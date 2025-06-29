import { Repository } from '@data/repo';
import { AppLoadContext } from 'react-router';

import { getDatabase } from './d1Db';

export function repository(context: AppLoadContext): Repository {
  const db = import.meta.env.DEV ? getDatabase() : context.cloudflare.env.DB;

  return Repository.openConnection(db);
}
