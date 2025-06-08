import { backgroundColor } from '../theme';

export type WebManifest = {
  name?: string;
  short_name?: string;
  icons: { src: string; sizes?: string; type?: string }[];
  theme_color: string;
  background_color: string;
  display: 'browser' | 'fullscreen' | 'standalone' | 'minimal-ui';
};

export const manifest: WebManifest = {
  name: 'Студенська Рада ФПМ',
  short_name: 'СР ФПМ',
  icons: [
    {
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
  theme_color: backgroundColor,
  background_color: backgroundColor,
  display: 'browser',
};
