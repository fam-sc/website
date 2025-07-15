import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
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
    layout('u/layout.tsx', [
      route('approve', 'u/approve/page.tsx'),
      route('info', 'u/info/page.tsx'),
      route('password', 'u/password/page.tsx'),
      route('roles', 'u/roles/page.tsx'),
      route('schedule-bot', 'u/schedule-bot/page.tsx'),
      route('admin-bot', 'u/admin-bot/page.tsx'),
      ...prefix('bot', [
        route('schedule', 'u/bot/schedule/page.tsx'),
        route('admin', 'u/bot/admin/page.tsx'),
      ]),
    ]),
    route('finish-sign-up', 'u/finish-sign-up/page.tsx'),
  ]),
  ...prefix('forgot-password', [
    route('email', 'forgot-password/email/page.tsx'),
    route('expired', 'forgot-password/expired/page.tsx'),
    route('success', 'forgot-password/success/page.tsx'),
    index('forgot-password/page.tsx'),
  ]),
  route('privacy-policy', 'privacy-policy/page.tsx'),
  route('schedule', 'schedule/page.tsx'),
  route('signin', 'signin/page.tsx'),
  route('signup', 'signup/page.tsx'),
  route('signup/email', 'signup/email/page.tsx'),
  route('students', 'students/page.tsx'),
  route('*', 'not-found.tsx'),
] satisfies RouteConfig;
