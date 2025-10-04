import { badRequest } from '@sc-fam/shared';
import { Middleware } from '@sc-fam/shared/router';

export function pollId<Args extends { params: { id: string } }>(): Middleware<
  number,
  Args
> {
  return ({ params }) => {
    const result = Number.parseInt(params.id);

    if (Number.isNaN(result)) {
      return badRequest({ message: 'Invalid poll id' });
    }

    return result;
  };
}
