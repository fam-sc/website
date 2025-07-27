export type NavigationItem = { title: string; href: string };

export const navigationMainRoutes: NavigationItem[] = [
  { title: 'Студентство', href: '/students' },
  { title: 'Розклад', href: '/schedule' },
  { title: 'Опитування', href: '/polls' },
  { title: 'Події', href: '/events' },
  { title: 'Гайди', href: '/guides' },
];

export const navigigationSecondaryRoutes: NavigationItem[] = [
  { title: 'Головна', href: '/' },
  ...navigationMainRoutes,
  { title: 'Галерея', href: '/gallery' },
];
