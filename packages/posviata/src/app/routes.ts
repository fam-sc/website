import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('home/page.tsx'),
  route('2023', '2023/page.tsx'),
  route('2024', '2024/page.tsx'),
  route('*', 'not-found/page.tsx'),
] satisfies RouteConfig;
