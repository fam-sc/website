import { methodNotAllowed, notFound } from '../responses';
import { HttpMethod } from './types';

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

    this.addPathPart(this.rootNode, parts, method, handler);
  }

  private addPathPart(
    parent: PathNode<Env>,
    parts: string[],
    method: HttpMethod,
    handler: Handler<Env>
  ) {
    const [firstPart, ...restParts] = parts;
    const isParam = firstPart.startsWith(':');
    const name = isParam ? firstPart.slice(1) : firstPart;

    let currentNode = isParam ? parent.paramNode?.value : parent.children[name];
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

    if (restParts.length === 0) {
      const currentHandlerNode = currentNode as HandlerPathNode<Env>;

      if (currentHandlerNode.handlers === undefined) {
        currentHandlerNode.handlers = {};
      }

      currentHandlerNode.handlers[method] = handler;
    } else {
      this.addPathPart(currentNode, restParts, method, handler);
    }
  }

  handleRequest(request: Request, env: Env) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith(this.prefix)) {
      const parts = pathname.slice(this.prefix.length + 1).split('/');

      return this.handleRequestByParts(parts, this.rootNode, request, env, {});
    }

    return Promise.resolve(notFound());
  }

  private handleRequestByParts(
    parts: string[],
    node: PathNode<Env>,
    request: Request,
    env: Env,
    params: Params
  ): Promise<Response> {
    if (parts.length > 0) {
      const [firstPart, ...restParts] = parts;
      let nextNode = node.children[firstPart];
      const nextParams = params;

      if (nextNode === undefined) {
        const { paramNode } = node;

        if (paramNode !== undefined) {
          nextNode = paramNode.value;
          nextParams[paramNode.name] = firstPart;
        }
      }

      if (nextNode !== undefined) {
        return this.handleRequestByParts(
          restParts,
          nextNode,
          request,
          env,
          nextParams
        );
      }
    } else if ('handlers' in node && node.handlers !== undefined) {
      const { handlers } = node;
      const handler = handlers[request.method as HttpMethod];

      return handler
        ? handler(request, { env, params })
        : Promise.resolve(methodNotAllowed(Object.keys(handlers)));
    }

    return Promise.resolve(notFound());
  }
}
