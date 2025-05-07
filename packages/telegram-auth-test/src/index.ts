export default {
  fetch(): Promise<Response> {
    return Promise.resolve(new Response());
  },
} satisfies ExportedHandler<Env>;
