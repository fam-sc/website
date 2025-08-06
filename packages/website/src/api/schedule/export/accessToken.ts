import { badRequest } from '@sc-fam/shared';
import { Middleware, RequestArgs } from '@sc-fam/shared/router';

export function accessToken<Args extends RequestArgs>(): Middleware<
  string,
  Args
> {
  return ({ request }) => {
    const accessToken = request.headers.get('X-Access-Token');
    if (accessToken === null) {
      return badRequest({ message: 'No access token' });
    }

    return accessToken;
  };
}
