import { isInvalid, Validator } from '../minivalidate';
import { badRequest } from '../responses';
import { Middleware, RequestArgs } from './middleware';

type ParamValidator<R = unknown> = Validator<R, string>;
type SearchParamsInput = Record<string, ParamValidator>;
type SearchParamsOutput<Input extends SearchParamsInput> = {
  [K in keyof Input]: Input[K] extends ParamValidator<infer R> ? R : never;
};

export function searchParams<
  T extends SearchParamsInput,
  Args extends RequestArgs,
>(input: T): Middleware<SearchParamsOutput<T>, Args> {
  type Output = SearchParamsOutput<T>;

  return ({ request }) => {
    const { searchParams } = new URL(request.url);
    const output: Partial<Output> = {};

    for (const key in input) {
      const validator = input[key];

      const value = searchParams.get(key);
      if (value === null) {
        return badRequest();
      }

      const result = validator(value);
      if (isInvalid(result)) {
        return badRequest();
      }

      output[key] = result as Output[keyof Output];
    }

    return output as Output;
  };
}
