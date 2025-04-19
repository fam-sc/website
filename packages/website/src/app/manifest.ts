import { MetadataRoute } from 'next';

import { backgroundColor } from '@/theme';

export default function manifest(): MetadataRoute.Manifest {
  return {
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
}
