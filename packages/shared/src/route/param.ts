import { methodNotAllowed, notFound } from '../responses';
import { HttpMethod } from './types';

const enum NodeType {
  LITERAL = 0,
  PARAM = 1,
}

type Params = Record<string, string>;

type Handler<Env> = (
  request: Request,
  args: { env: Env; params: Params }
) => Promise<Response>;

type HandlerMap<Env> = Partial<Record<HttpMethod, Handler<Env>>>;

interface BasePathNode<Env> {
  type: NodeType;
  name: string;
  children: PathNode<Env>[];
}

interface HandlerPathNode<Env> extends BasePathNode<Env> {
  handlers: HandlerMap<Env>;
}

type PathNode<Env> = BasePathNode<Env> | HandlerPathNode<Env>;

function handleRequestMethod<Env>(
  map: HandlerMap<Env>,
  request: Request,
  env: Env,
  params: Params
) {
  const handler = map[request.method as HttpMethod];

  return handler
    ? handler(request, { env, params })
    : Promise.resolve(methodNotAllowed(Object.keys(request.method)));
}

export class ParamRouter<Env> {
  private paths: PathNode<Env>[] = [];

  get = this.createPathHandler('GET');
  post = this.createPathHandler('POST');
  put = this.createPathHandler('PUT');
  patch = this.createPathHandler('PATCH');
  delete = this.createPathHandler('DELETE');

  private createPathHandler(method: HttpMethod) {
    return (path: string, handler: Handler<Env>) => {
      this.addPath(path, method, handler);
    };
  }

  private addPath(path: string, method: HttpMethod, handler: Handler<Env>) {
    const [firstPart, ...restParts] = path.slice(1).split('/');
    if (firstPart.startsWith(':')) {
      throw new Error('First path part cannot be param');
    }

    let currentNode = this.paths.find((node) => node.name === firstPart);
    if (currentNode === undefined) {
      currentNode = {
        type: NodeType.LITERAL,
        name: firstPart,
        children: [],
      };

      this.paths.push(currentNode);
    }

    if (restParts.length === 0) {
      const currentHandlerNode = currentNode as HandlerPathNode<Env>;

      currentHandlerNode.handlers = {
        ...currentHandlerNode.handlers,
        [method]: handler,
      };
    }

    this.addPathPart(currentNode, restParts, method, handler);
  }

  private addPathPart(
    node: PathNode<Env>,
    parts: string[],
    method: HttpMethod,
    handler: Handler<Env>
  ) {
    if (parts.length === 0) {
      return;
    }

    const [firstPart, ...restParts] = parts;
    let currentNode = node.children.find((node) => node.name === firstPart);
    if (currentNode === undefined) {
      currentNode = firstPart.startsWith(':')
        ? {
            type: NodeType.LITERAL,
            name: firstPart,
            children: [],
          }
        : {
            type: NodeType.PARAM,
            name: firstPart.slice(1),
            children: [],
          };

      this.paths.push(currentNode);
    }

    if (restParts.length === 0) {
      const currentHandlerNode = currentNode as HandlerPathNode<Env>;

      currentHandlerNode.handlers = {
        ...currentHandlerNode.handlers,
        [method]: handler,
      };
    }

    this.addPathPart(currentNode, restParts, method, handler);
  }

  handleRequest(request: Request, env: Env) {
    const { pathname } = new URL(request.url);

    const [firstPart, ...parts] = pathname.slice(1).split('/');

    const node = this.paths.find((node) => node.name === firstPart);
    if (node !== undefined) {
      return this.handleRequestByParts(parts, node, request, env, {});
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
      let nextNode = node.children.find(
        (node) => node.type === NodeType.LITERAL && node.name === firstPart
      );

      if (nextNode !== undefined) {
        return this.handleRequestByParts(
          restParts,
          nextNode,
          request,
          env,
          params
        );
      }

      nextNode = node.children.find((node) => node.type === NodeType.PARAM);

      if (nextNode !== undefined) {
        return this.handleRequestByParts(restParts, nextNode, request, env, {
          ...params,
          [nextNode.name]: firstPart,
        });
      }
    } else if ('handlers' in node) {
      return handleRequestMethod(node.handlers, request, env, params);
    }

    return Promise.resolve(notFound());
  }
}
