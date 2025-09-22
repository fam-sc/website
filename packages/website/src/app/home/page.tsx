import { WebSite } from 'schema-dts';

import { ColumnText } from '@/components/ColumnText';
import { Image } from '@/components/Image';
import { Swiper } from '@/components/Swiper';
import { TextWithImage } from '@/components/TextWithImage';
import { Title } from '@/components/Title';
import InvitationImage from '@/images/logo-2.png?multiple';
import SwiperImage1 from '@/images/swiper/1.jpg?multiple';
import SwiperImage2 from '@/images/swiper/2.jpg?multiple';
import SwiperImage3 from '@/images/swiper/3.png?multiple';
import { PageHandle } from '@/utils/handle';

import GreetingContent from './greeting.md?react';
import styles from './page.module.scss';

export const handle: PageHandle<WebSite> = {
  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Студрада ФПМ',
    url: 'https://sc-fam.org/',
    alternateName: ['СР ФПМ', 'Студентська рада ФПМ', 'sc-fam.org'],
  },
};

export default function HomePage() {
  return (
    <>
      <Title>Головна</Title>

      <Swiper
        className={styles['image-swiper']}
        slides={[SwiperImage1, SwiperImage2, SwiperImage3].map((images) => ({
          id: images[0].src,
          images,
        }))}
        renderSlide={({ images }) => (
          <Image
            multiple={images}
            sizes={{ default: '30vw' }}
            draggable={false}
          />
        )}
      />

      <ColumnText className={styles.greeting} variant="bodyLarge">
        <GreetingContent />
      </ColumnText>

      <TextWithImage
        className={styles.invitation}
        title="Цей час настав!"
        subtext="Заповни цю коротку форму та очікуй на фідбек, щоб стати частиною нашої команди;)"
        image={InvitationImage}
        button={{
          title: 'Стань частиною команди!',
          href: 'https://t.me/fpm_sc_bot',
        }}
      />
    </>
  );
}
