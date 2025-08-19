declare module 'virtual:utils/reactDomEnv' {
  export function renderResponse(
    request: Request,
    context: EntryContext,
    responseStatusCode: number,
    responseHeaders: Headers
  ): Promise<Response>;
}
