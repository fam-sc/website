import { parseInt, searchParamsToObject } from '@sc-fam/shared';
import { TelegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/types.js';

import { BotPageError } from '.';

type ParseResult = {
  value: TelegramBotAuthPayload | null;
  error: BotPageError | null;
};

export function parseSearchParamsToAuthPayload(
  params: URLSearchParams
): ParseResult {
  const paramsObject = searchParamsToObject(params);
  const { username, first_name, last_name, photo_url, hash } = paramsObject;
  const id = parseInt(paramsObject.id);
  const auth_date = parseInt(paramsObject.auth_date);

  if (
    id === undefined ||
    username === undefined ||
    first_name === undefined ||
    auth_date === undefined ||
    hash === undefined
  ) {
    return { value: null, error: BotPageError.INVALID_PARAMS };
  }

  return {
    value: { id, username, first_name, last_name, auth_date, photo_url, hash },
    error: null,
  };
}
