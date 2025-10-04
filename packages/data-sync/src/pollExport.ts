import { Repository } from '@sc-fam/data';
import { getTwoLeggedAccessToken, scope } from '@sc-fam/shared/api/google';
import { exportPollToSpreadsheet } from '@sc-fam/shared-polls';

import { getServiceAccountAuthOptions } from './googleAuth';

export async function exportPolls(env: Env) {
  const repo = Repository.openConnection();
  const ids = await repo.polls().getPollIdsWithSpreadsheet();

  console.log(`Exporting polls: ${ids.join(', ')}`);

  const options = await getServiceAccountAuthOptions(
    env,
    scope('spreadsheets')
  );
  const access = await getTwoLeggedAccessToken(options);

  await Promise.all(ids.map((id) => exportPollToSpreadsheet(id, access)));
}
