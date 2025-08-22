import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('home/page.tsx'),
  route('*', 'not-found/page.tsx'),
] satisfies RouteConfig;
