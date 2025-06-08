import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('home/page.tsx'),
  ...prefix('events', [
    route('+', 'events/+/page.tsx'),
    route(':id', 'events/[id]/page.tsx'),
    index('events/(list)/page.tsx'),
  ]),
  ...prefix('gallery', [
    route('upload', 'gallery/upload/page.tsx'),
    index('gallery/(main)/page.tsx'),
  ]),
  ...prefix('polls', [
    route('+', 'polls/+/page.tsx'),
    route(':id/info', 'polls/[id]/info/page.tsx'),
    route(':id', 'polls/[id]/(main)/page.tsx'),
    index('polls/(list)/page.tsx'),
  ]),
  ...prefix('u', [
    layout('u/(default-layout)/layout.tsx', [
      route('approve', 'u/(default-layout)/approve/page.tsx'),
      route('info', 'u/(default-layout)/info/page.tsx'),
      route('password', 'u/(default-layout)/password/page.tsx'),
      route('roles', 'u/(default-layout)/roles/page.tsx'),
      route('telegram-auth', 'u/(default-layout)/telegram-auth/page.tsx'),
    ]),
    route('finish-sign-up', 'u/finish-sign-up/page.tsx'),
  ]),
  route('privacy-policy', 'privacy-policy/page.tsx'),
  route('schedule', 'schedule/page.tsx'),
  route('sign', 'sign/page.tsx'),
  route('sign/email', 'sign/email/page.tsx'),
  route('students', 'students/page.tsx'),
  route('*', 'not-found.tsx'),
] satisfies RouteConfig;
