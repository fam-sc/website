export function badRequest() {
  return new Response('Bad Request', { status: 400 });
}
