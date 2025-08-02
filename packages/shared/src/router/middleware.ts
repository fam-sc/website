import { ZodMiniType } from 'zod/v4-mini';

import { badRequest } from '../responses';

type MaybePromise<T> = T | Promise<T>;

export type RequestArgs = {
  request: Request;
};

export interface MiddlewareArgs<Env, Params, T> extends RequestArgs {
  env: Env;
  params: Params;
  data: T;
}

export type Middleware<T, Args> = (args: Args) => MaybePromise<T | Response>;

type MiddlewareWithArgs<T, Env, Params, Args> = Middleware<
  T,
  MiddlewareArgs<Env, Params, Args>
>;

type MiddlewareHandler<Env, Params> = (
  request: Request,
  options: { env: Env; params: Params }
) => Promise<Response>;

type MiddlewareSequence<
  Args extends unknown[],
  Env,
  Params,
  Previous extends unknown[] = [],
> = Args extends [infer First, ...infer Rest]
  ? [
      MiddlewareWithArgs<First, Env, Params, Previous>,
      ...MiddlewareSequence<Rest, Env, Params, [...Previous, First]>,
    ]
  : [];

export function middlewareHandler<T1, Params, Env>(
  ...transformers: MiddlewareSequence<[T1, Response], Env, Params>
): MiddlewareHandler<Env, Params>;

export function middlewareHandler<T1, T2, Params, Env>(
  ...transformers: MiddlewareSequence<[T1, T2, Response], Env, Params>
): MiddlewareHandler<Env, Params>;

export function middlewareHandler<T1, T2, T3, Params, Env>(
  ...transformers: MiddlewareSequence<[T1, T2, T3, Response], Env, Params>
): MiddlewareHandler<Env, Params>;

export function middlewareHandler<Env, Params>(
  ...transformers: unknown[]
): MiddlewareHandler<Env, Params> {
  type UnknownMiddleare = MiddlewareWithArgs<unknown, Env, Params, unknown[]>;

  return async (request, { env, params }) => {
    const backlog: unknown[] = [];

    for (const rawTransformer of transformers) {
      const transformer = rawTransformer as UnknownMiddleare;
      const result = await transformer({ request, env, params, data: backlog });

      backlog.push(result);
    }

    const last = backlog.at(-1);
    if (!(last instanceof Response)) {
      throw new TypeError('Last result must be Response');
    }

    return last;
  };
}

export function json<Args extends RequestArgs>(): Middleware<unknown, Args> {
  return ({ request }) => request.json();
}

export function formData<T, Args extends RequestArgs>(
  map: (formData: FormData) => T
): Middleware<T, Args> {
  return async ({ request }) => {
    const formData = await request.formData();

    return map(formData);
  };
}

export function zodSchema<Output, Input, Args extends RequestArgs>(
  schema: ZodMiniType<Output, Input>
): Middleware<Output, Args> {
  return async ({ request }) => {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      console.error(result.error);
      return badRequest();
    }

    return result.data;
  };
}
