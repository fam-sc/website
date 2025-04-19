/* eslint-disable jsx-a11y/alt-text */
'use client';

import InvitationImage from '@public/images/logo-2.png';
import Image from 'next/image';

import styles from './page.module.scss';

import { ColumnText } from '@/components/ColumnText';
import { Swiper } from '@/components/Swiper';
import { TextWithImage } from '@/components/TextWithImage';
import { Typography } from '@/components/Typography';
import { ImageInfo } from '@/image/info';

export type ClientComponentProps = {
  swiperSlides: (ImageInfo & { id: string })[];
};

const greetingText = `Містер і місіс Дурслі, що жили в будинку номер чотири на вуличці Прівіт-драйв, пишалися тим, що були, слава Богу, абсолютно нормальними. Кого-кого, але тільки не їх можна було б запідозрити, що вони пов'язані з таємницями чи дивами, бо такими дурницями вони не цікавилися. Містер Дурслі керував фірмою "Ґраннінґс", яка виготовляла свердла. То був такий дебелий чолов'яга, що, здається, й шиї не мав, зате його обличчя прикрашали пишні вуса. Натомість місіс Дурслі була худорлява, білява, а її шия була майже вдвічі довша, ніж у звичайних людей, і це ставало їй у великій пригоді: надто вже вона полюбляла зазирати через паркан, підглядаючи за сусідами. Подружжя Дурслі мало синочка Дадлі, що був, на думку батьків, найкращим у світі.`;

function GreetingText() {
  return (
    <ColumnText className={styles.greeting} variant="bodyLarge">
      <Typography as="span" variant="h4" className={styles['greeting-header']}>
        Потужнічі в СР ФПМ
      </Typography>

      {greetingText}
    </ColumnText>
  );
}

export function ClientComponent({ swiperSlides }: ClientComponentProps) {
  return (
    <>
      <Swiper
        className={styles['image-swiper']}
        slides={swiperSlides}
        renderSlide={(image) => <Image {...image} draggable={false} />}
      />

      <GreetingText />

      <TextWithImage
        className={styles.invitation}
        title="Цей час настав!"
        subtext="Заповни цю коротку форму та очікуй на фідбек, щоб стати частиною нашої команди;)"
        image={{ ...InvitationImage, alt: '' }}
        button={{
          title: 'Стань частиною команди!',
          href: 'https://t.me/fpm_sc_bot',
        }}
      />
    </>
  );
}
