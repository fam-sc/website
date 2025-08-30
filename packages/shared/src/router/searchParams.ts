import { isInvalid, Validator } from '../minivalidate';
import { badRequest } from '../responses';
import { Middleware, RequestArgs } from './middleware';

type OptionalMarker<T> = { __optional: T };

type ParamValidator<R = unknown, Optional extends boolean = false> = Validator<
  R,
  string,
  Optional
>;

type SearchParamsInput = Record<string, ParamValidator<unknown, boolean>>;

type SelectOptionalKeys<T> = {
  [K in keyof T]: T[K] extends OptionalMarker<unknown> ? K : never;
}[keyof T];

type ResolveOptional<T> = Partial<{
  [K in SelectOptionalKeys<T>]: T[K] extends OptionalMarker<infer R>
    ? R
    : never;
}> &
  Pick<T, Exclude<keyof T, SelectOptionalKeys<T>>>;

type SearchParamsOutput<Input extends SearchParamsInput> = ResolveOptional<{
  [K in keyof Input]: Input[K] extends ParamValidator<infer R, infer Optional>
    ? true extends Optional
      ? OptionalMarker<R>
      : R
    : never;
}>;

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

      if (!validator.isOptional && value === null) {
        return badRequest();
      }

      if (value !== null) {
        const result = validator(value);
        if (isInvalid(result)) {
          return badRequest();
        }

        // @ts-expect-error Typescript can't infer that result is the correct type.
        output[key] = result;
      }
    }

    return output as Output;
  };
}
