import { expect, test, vi } from 'vitest';

import { ParamRouter } from './param';

const handler = () => Promise.resolve(new Response());

function request(pathname: string, method?: string): Request {
  return new Request(`https://test.com${pathname}`, { method });
}

test('smoke', () => {
  const app = new ParamRouter();
  app.get('/route', handler);
  app.get('/route', handler);

  app.get('/route2', handler);
  app.post('/route2/:id', handler);
  app.patch('/route2/:id', handler);
  app.post('/route2/:id/route3', handler);
});

test('one-part get', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/route', vhandler);

  await app.handleRequest(request('/route'), null);
  expect(vhandler).toHaveBeenCalledOnce();
});

test('one-part post with get', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/route', handler);
  app.post('/route', vhandler);

  await app.handleRequest(request('/route', 'POST'), null);
  expect(vhandler).toHaveBeenCalledOnce();
});

test('two-part post with get', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/route/route2', handler);
  app.post('/route/route2', vhandler);

  await app.handleRequest(request('/route/route2', 'POST'), null);
  expect(vhandler).toHaveBeenCalledOnce();
});

test('three-part post with get', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/route/route2', handler);
  app.post('/route/route2/route3', vhandler);

  await app.handleRequest(request('/route/route2/route3', 'POST'), null);
  expect(vhandler).toHaveBeenCalledOnce();
});

test('two-part post with parameter', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/route/:id', handler);
  app.post('/route/:id', vhandler);

  const req = request('/route/3', 'POST');

  await app.handleRequest(req, null);
  expect(vhandler).toHaveBeenCalledWith(req, {
    env: null,
    params: { id: '3' },
  });
});

test('two-part post with parameter before literal', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/route/:id/action', handler);
  app.post('/route/:id/action', vhandler);

  const req = request('/route/3/action', 'POST');

  await app.handleRequest(req, null);
  expect(vhandler).toHaveBeenCalledWith(req, {
    env: null,
    params: { id: '3' },
  });
});

test('two-part post with parameters before literal', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/route/:id/action/:id2', handler);
  app.post('/route/:id/action/:id2', vhandler);

  const req = request('/route/3/action/4', 'POST');

  await app.handleRequest(req, null);
  expect(vhandler).toHaveBeenCalledWith(req, {
    env: null,
    params: { id: '3', id2: '4' },
  });
});

test('not found', async () => {
  const app = new ParamRouter();
  app.get('/route/:id/action/:id2', handler);

  const response = await app.handleRequest(request('/route'), null);

  expect(response.status).toBe(404);
});

test('method not allowed', async () => {
  const app = new ParamRouter();
  app.get('/route', handler);

  const response = await app.handleRequest(request('/route', 'POST'), null);

  expect(response.status).toBe(405);
});

test('events test', async () => {
  const vhandler = vi.fn(handler);

  const app = new ParamRouter();
  app.get('/api/events/:id', handler);
  app.put('/api/events/:id', vhandler);
  app.delete('/api/events/:id', handler);

  const req = request('/api/events/123', 'PUT');

  await app.handleRequest(req, null);
  expect(vhandler).toHaveBeenCalledWith(req, {
    env: null,
    params: { id: '123' },
  });
});
