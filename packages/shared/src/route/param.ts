import { methodNotAllowed, notFound } from '../responses';
import { HttpMethod } from './types.js';

type Params<P extends string[] = string[]> = Record<P[number], string>;

type ResolvePathPart<P extends string> = P extends `:${infer Name}`
  ? [Name]
  : [];

type ResolvePathParams<P extends string> = P extends `/${infer Rest}`
  ? ResolvePathParams<Rest>
  : P extends `${infer Param}/${infer Rest}`
    ? [...ResolvePathPart<Param>, ...ResolvePathParams<Rest>]
    : P extends `${infer Param}`
      ? ResolvePathPart<Param>
      : [];

type Handler<Env, P extends string[] = string[]> = (
  request: Request,
  args: { env: Env; params: Params<P> }
) => Promise<Response>;

type HandlerMap<Env, P extends string[] = string[]> = Partial<
  Record<HttpMethod, Handler<Env, P>>
>;

interface BasePathNode<Env> {
  paramNode?: { name: string; value: BasePathNode<Env> };
  children: Record<string, BasePathNode<Env> | undefined>;
}

interface HandlerPathNode<Env> extends BasePathNode<Env> {
  handlers?: HandlerMap<Env>;
}

type PathNode<Env> = BasePathNode<Env> | HandlerPathNode<Env>;

export class ParamRouter<Env> {
  private rootNode: BasePathNode<Env> = { children: {} };
  private prefix: string;

  get = this.createPathHandler('GET');
  post = this.createPathHandler('POST');
  put = this.createPathHandler('PUT');
  patch = this.createPathHandler('PATCH');
  delete = this.createPathHandler('DELETE');

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  private createPathHandler(method: HttpMethod) {
    return <P extends string>(
      path: P,
      handler: Handler<Env, ResolvePathParams<P>>
    ) => {
      this.addPath(path, method, handler);
    };
  }

  private addPath(path: string, method: HttpMethod, handler: Handler<Env>) {
    const parts = path.slice(1).split('/');

    let parent: PathNode<Env> = this.rootNode;

    for (const part of parts) {
      const isParam = part.startsWith(':');
      const name = isParam ? part.slice(1) : part;

      let currentNode = isParam
        ? parent.paramNode?.value
        : parent.children[name];

      if (currentNode === undefined) {
        if (
          isParam &&
          parent.paramNode !== undefined &&
          parent.paramNode.name !== name
        ) {
          throw new Error('Already have param route');
        }

        currentNode = { children: {} };

        if (isParam) {
          parent.paramNode = { name, value: currentNode };
        } else {
          parent.children[name] = currentNode;
        }
      }

      parent = currentNode;
    }

    const currentHandlerNode = parent as HandlerPathNode<Env>;

    if (currentHandlerNode.handlers === undefined) {
      currentHandlerNode.handlers = {};
    }

    currentHandlerNode.handlers[method] = handler;
  }

  handleRequest(request: Request, env: Env) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith(this.prefix)) {
      const params: Record<string, string> = {};
      const parts = pathname.slice(this.prefix.length + 1).split('/');
      let parent: PathNode<Env> = this.rootNode;

      for (const part of parts) {
        let nextNode = parent.children[part];

        if (nextNode === undefined) {
          const { paramNode } = parent;

          if (paramNode !== undefined) {
            nextNode = paramNode.value;
            params[paramNode.name] = part;
          } else {
            return Promise.resolve(notFound());
          }
        }

        parent = nextNode;
      }

      if ('handlers' in parent && parent.handlers) {
        const { handlers } = parent;
        const handler = handlers[request.method as HttpMethod];

        return handler
          ? handler(request, { env, params })
          : Promise.resolve(methodNotAllowed(Object.keys(handlers)));
      }
    }

    return Promise.resolve(notFound());
  }
}
