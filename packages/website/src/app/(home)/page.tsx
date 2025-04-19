import fs from 'node:fs/promises';

import { ClientComponent } from './client-component';

import { ImageInfo, readPublicImageInfo } from '@/image/info';

async function getSwiperImages(): Promise<(ImageInfo & { id: string })[]> {
  const entries = await fs.readdir('./public/images/swiper');
  entries.sort();

  return Promise.all(
    entries.map(async (entry) => {
      const info = await readPublicImageInfo(`images/swiper/${entry}`);

      return {
        id: info.src,
        ...info,
      };
    })
  );
}

export default async function HomePage() {
  const swiperImages = await getSwiperImages();

  return <ClientComponent swiperSlides={swiperImages} />;
}
