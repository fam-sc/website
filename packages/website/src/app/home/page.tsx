import InvitationImage from '@/images/logo-2.png?multiple';

import { ColumnText } from '@/components/ColumnText';
import { Swiper } from '@/components/Swiper';
import { TextWithImage } from '@/components/TextWithImage';
import { Typography } from '@/components/Typography';

import SwiperImage1 from '@/images/swiper/1.jpg?multiple';
import SwiperImage2 from '@/images/swiper/2.jpg?multiple';
import SwiperImage3 from '@/images/swiper/3.png?multiple';

import styles from './page.module.scss';
import { Title } from '@/components/Title';
import { Image } from '@/components/Image';
import greeting from './greetingText.json';

function GreetingText() {
  return (
    <ColumnText className={styles.greeting} variant="bodyLarge">
      <Typography as="span" variant="h4" className={styles['greeting-header']}>
        Потужнічі в СР ФПМ
      </Typography>

      {greeting.text}
    </ColumnText>
  );
}

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
            alt=""
            draggable={false}
          />
        )}
      />

      <GreetingText />

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
