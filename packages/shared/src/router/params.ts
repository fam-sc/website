import { parseInt } from '../parseInt';
import { Middleware } from './middleware';

type ParamTransformer<T = unknown> = (value: string) => T | Response;
type ParamInput<K extends string = string> = Record<K, ParamTransformer>;

type ParamOutput<Input extends ParamInput> = {
  [K in keyof Input]: Input[K] extends ParamTransformer<infer R> ? R : never;
};

export function params<K extends string, Input extends ParamInput<K>>(
  input: Input
): Middleware<ParamOutput<Input>, { params: Record<K, string> }> {
  type Output = ParamOutput<Input>;

  return ({ params }) => {
    const output: Partial<Output> = {};

    for (const key in params) {
      const transformer = input[key];

      const result = transformer(params[key]);
      if (result instanceof Response) {
        return result;
      }

      output[key] = result as Output[keyof Output];
    }

    return output as Output;
  };
}

export function int(error: () => Response): ParamTransformer<number> {
  return (value) => {
    const result = parseInt(value);

    return result !== undefined ? result : error();
  };
}
