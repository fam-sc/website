import { Repository } from '@sc-fam/data';
import { AppLoadContext } from 'react-router';

import { getDatabase } from './d1Db';

export function repository(context: AppLoadContext): Repository {
  const db =
    import.meta.env.VITE_HOST === 'node'
      ? getDatabase()
      : context.cloudflare.env.DB;

  return Repository.openConnection(db);
}
