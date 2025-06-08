import InvitationImage from '@/images/logo-2.png';

import { ColumnText } from '@/components/ColumnText';
import { Swiper } from '@/components/Swiper';
import { TextWithImage } from '@/components/TextWithImage';
import { Typography } from '@/components/Typography';

import SwiperImage1 from '@/images/swiper/1.jpg';
import SwiperImage2 from '@/images/swiper/2.jpg';
import SwiperImage3 from '@/images/swiper/3.png';

import styles from './page.module.scss';

const greetingText = `Студентська рада факультету прикладної математики - це живе серце студентського життя,
 де майбутні математики, програмісти та аналітики об'єднуються для самореалізації та росту. 
 Головна ідея - створити простір, де кожен студент може знайти свій голос і шлях, адже математика це не лише 
 формули, а спосіб мислення, що може змінити світ.
 
Основний фокус зосереджений на розвитку як академічних, так і особистісних навичок через організацію хакатонів,
програмістських змагань та зустрічей з випускниками з великих IT-компаній. Особлива увага приділяється створенню 
міцного комьюніті через неформальні зустрічі, спільні проекти між курсами та менторські програми.

Студрада розуміє, що успіх у математиці залежить не лише від індивідуальних здібностей, а й від підтримки оточення.
Вони активно працюють над збалансованим студентським життям, організовуючи спортивні турніри, творчі вечори та екскурсії в IT-компанії.
Основна візія - виховати не просто кваліфікованих спеціалістів, а всебічно розвинених особистостей,
готових до викликів сучасного світу.`;

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

export function ClientComponent() {
  return (
    <>
      <title>Головна</title>

      <Swiper
        className={styles['image-swiper']}
        slides={[SwiperImage1, SwiperImage2, SwiperImage3].map((id) => ({
          id,
        }))}
        renderSlide={({ id }) => <img src={id} alt="" draggable={false} />}
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
