/* eslint-disable react/no-unescaped-entities */

import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.privacyWrapper}>
      <Title>Політика конфіденційності</Title>

      <Typography as="h1" variant="h3" className={styles.title}>
        Політика конфіденційності
      </Typography>

      <Typography as="p" variant="bodyLarge" className={styles.paragraph}>
        Ми поважаємо вашу конфіденційність і прагнемо захищати особисту
        інформацію, яку ви надаєте через наш вебсайт.
        <br />
        Ця Політика Конфіденційності описує, як Студентська Рада Факультету
        прикладної математики НТУУ "Київський політехнінчий інститут ім. І.
        Сікорського" (далі – "Ми", "Нас" або "Студентська Рада") збирає,
        використовує та захищає вашу особисту інформацію, коли ви користуєтеся
        нашим веб-сайтом <a href="https://sc-fam.org/">https://sc-fam.org/</a>
        (далі – "Сайт").
      </Typography>

      <Typography as="p" variant="bodyLarge" className={styles.paragraph}>
        Ми прагнемо забезпечити захист вашої конфіденційності та дотримуємося
        вимог законодавства України про захист персональних даних. Користуючись
        нашим Сайтом, ви погоджуєтеся з умовами цієї Політики Конфіденційності.
      </Typography>

      <Typography as="h2" variant="h5" className={styles.subtitle}>
        Яку інформацію ми збираємо?
      </Typography>
      <Typography as="p" variant="body" className={styles.paragraph}>
        Ми можемо збирати та обробляти наступні типи персональних даних:
        <br />
        Реєстраційна інформація: Під час реєстрації на Сайті або для участі в
        заходах ми можемо збирати ваше ім'я, прізвище, номер студентського
        квитка, факультет, групу, курс навчання та дату реєстрації.
        <br />
        Контактні дані: Ми можемо збирати вашу адресу електронної пошти, номер
        телефону та посилання на профілі в соціальних мережах (за вашим
        бажанням) для комунікації та інформування.
        <br />
        Інформація про заходи: Ми збираємо інформацію про вашу реєстрацію та
        участь у заходах, організованих Студентською Радою.
        <br />
        Інформація про групи студентів: Ми можемо збирати інформацію про вашу
        приналежність до певних студентських груп, комітетів чи ініціатив в
        рамках діяльності Студентської Ради.
        <br />
        Технічні дані: Ми можемо автоматично збирати інформацію про ваш візит на
        Сайт, включаючи вашу IP-адресу, тип браузера, операційну систему,
        сторінки, які ви переглядали, та час візиту. Ця інформація збирається з
        метою покращення роботи Сайту та аналізу його використання.
      </Typography>

      <Typography as="h2" variant="h5" className={styles.subtitle}>
        Як ми використовуємо цю інформацію?
      </Typography>
      <Typography as="p" variant="body" className={styles.paragraph}>
        Ми використовуємо зібрану інформацію для наступних цілей:
        <br />
        Забезпечення функціонування Сайту: Для адміністрування вашого облікового
        запису, надання вам доступу до функцій Сайту та забезпечення його
        належної роботи.
        <br />
        Організація та проведення заходів: Для реєстрації на заходи,
        інформування про деталі проведення та збору зворотного зв'язку.
        <br />
        Комунікація та інформування: Для надсилання вам важливих повідомлень,
        новин, анонсів заходів та іншої інформації, пов'язаної з діяльністю
        Студентської Ради.
        <br />
        Внутрішня звітність та аналіз: Для аналізу ефективності наших заходів,
        покращення роботи Студентської Ради та нашого Сайту.
        <br />
        Представництво інтересів студентів: Для розуміння потреб студентів та
        представлення їхніх інтересів перед адміністрацією навчального закладу.
        <br />
        Дотримання законодавства: Для виконання вимог законодавства України.
      </Typography>

      <Typography as="h2" variant="h5" className={styles.subtitle}>
        Безпека
      </Typography>
      <Typography as="p" variant="body" className={styles.paragraph}>
        Ми вживаємо належних технічних та організаційних заходів для захисту
        вашої особистої інформації від несанкціонованого доступу, зміни,
        розголошення або знищення.
        <br />
        Доступ до вашої особистої інформації мають лише уповноважені члени
        Студентської Ради, які зобов'язані зберігати її конфіденційність.
      </Typography>

      <Typography as="h2" variant="h5" className={styles.subtitle}>
        Ваші права
      </Typography>

      <Typography as="p" variant="body" className={styles.paragraph}>
        Доступ до вашої інформації: Ви можете запитати у нас інформацію про те,
        які ваші персональні дані ми зберігаємо.
        <br />
        Виправлення вашої інформації: Ви можете вимагати виправлення будь-якої
        неточної або неповної інформації про вас.
        <br />
        Видалення вашої інформації: Ви можете вимагати видалення вашої особистої
        інформації, якщо для її зберігання більше немає законних підстав.
        <br />
        Обмеження обробки: Ви можете вимагати обмеження обробки вашої особистої
        інформації за певних умов.
        <br />
        Заперечення проти обробки: Ви можете заперечувати проти обробки вашої
        особистої інформації за певних умов.
        <br />
        Відкликання згоди: Якщо обробка вашої інформації ґрунтується на вашій
        згоді, ви маєте право відкликати її в будь-який час.
      </Typography>

      <Typography as="h2" variant="h5" className={styles.subtitle}>
        Зв’язок з нами
      </Typography>

      <Typography as="p" variant="body" className={styles.paragraph}>
        Якщо у вас виникли будь-які питання щодо цієї Політики Конфіденційності
        або обробки ваших персональних даних, будь ласка, зв'яжіться з нами:
        <br />
        Бот підтримки:{' '}
        <a
          href="https://t.me/sc_fam_bot"
          target="_blank"
          rel="noopener noreferrer"
        >
          @sc_fam_bot
        </a>
        <br />
        Електронна пошта:{' '}
        <a href="mailto:sr.fam.kpi@gmail.com">sr.fam.kpi@gmail.com</a>
        <br />
        Адреса: Київ, вул. Політехнічна, 14-а, корпус № 15, кабінет 15-91
      </Typography>
    </div>
  );
}
