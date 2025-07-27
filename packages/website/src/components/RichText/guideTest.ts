import { RichTextString } from '@sc-fam/shared/richText';
export const testRichText: RichTextString = [
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: '#%D0%A1%D1%82%D1%83%D0%B4%D1%80%D0%B0%D0%B4%D0%B0' },
        children: [{ name: 'em', children: ['Студрада ФПМ'] }],
      },
      { name: 'em', children: [' '] },
      {
        name: 'a',
        attrs: {
          href: '#%D0%9F%D1%80%D0%BE%D1%84%D0%B1%D1%8E%D1%80%D0%BE-%D0%A4%D0%9F%D0%9C',
        },
        children: [
          {
            name: 'em',
            children: [
              { name: 'br', attrs: { class: 'inline' } },
              'Профбюро ФПМ',
            ],
          },
        ],
      },
      { name: 'em', children: [' '] },
      {
        name: 'a',
        attrs: {
          href: '#%D0%97%D0%B0%D0%B3%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%9A%D0%9F%D0%86%D1%88%D0%BD%D1%96-%D1%88%D1%82%D1%83%D0%BA%D0%B8',
        },
        children: [
          {
            name: 'em',
            children: [
              { name: 'br', attrs: { class: 'inline' } },
              'Загальні активності в КПІ',
            ],
          },
        ],
      },
      ' ',
      { name: 'br', attrs: { class: 'inline' } },
      {
        name: 'a',
        attrs: { href: '#%D0%93%D1%83%D1%80%D1%82%D0%BA%D0%B8' },
        children: [{ name: 'em', children: ['Гуртки'] }],
      },
      ' ',
      { name: 'br', attrs: { class: 'inline' } },
    ],
  },
  { name: 'hr' },
  {
    name: 'blockquote',
    children: [
      '"Я, як і більшість, при вступі  орієнтувалась на якість навчання,  яка звісно на вищому рівні.  Але зараз погодилась би знов вступити лиш заради спільноти."',
    ],
  },
  { name: 'hr' },
  { name: 'p', children: ['Спершу розкажу про те, що маємо у нас на ФПМ:'] },
  { name: 'h3', attrs: { id: 'Студрада' }, children: ['Студрада '] },
  {
    name: 'p',
    children: [
      {
        name: 'em',
        children: [
          "Студрада - це об'єднання активних студентів, що працюють задля кращого життя всього факультету. ",
        ],
      },
    ],
  },
  { name: 'p', children: ['Робота йде у кількох напрямках:'] },
  { name: 'p', children: [{ name: 'br' }] },
  { name: 'p', children: [{ name: 'strong', children: ['1. Івенти 💃'] }] },
  {
    name: 'p',
    children: [
      'Місце познайомитись, відпочити та провести час у компанії однодумців) ',
      { name: 'br', attrs: { class: 'inline' } },
      "Заходи на будь-який смак: перегляди фільмів, вечори настолок, вечірки та активний відпочинок на природі. Чудово об'єднує під час дистанційки 😉",
    ],
  },
  { name: 'p', children: ['P.S. ПОСВЯТА - це теж івент від СР🍻'] },
  { name: 'p', children: [{ name: 'br' }] },
  { name: 'p', children: [{ name: 'strong', children: ['2. Освіта 🤓'] }] },
  {
    name: 'p',
    children: [
      'Окрім того, що у нас чудові викладачі та актуальні навчальні програми, є група студентів, що допомагають з підготовкою до найважчих контролів. Вони й пишуть гайди, а ще готові відповісти на будь-яке питання та додатково пояснити вивчений матеріал.',
    ],
  },
  {
    name: 'p',
    children: [
      "Для зв'язку та виклику допомоги є відповідний бот!",
      { name: 'br', attrs: { class: 'inline' } },
      { name: 'br', attrs: { class: 'inline' } },
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  { name: 'p', children: [{ name: 'strong', children: ['3. Мерч 💅'] }] },
  {
    name: 'p',
    children: [
      'Будучи студентом кращого факультету хочеться якось продемонструвати це всім? Таке ми теж пропонуємо) ',
    ],
  },
  { name: 'p', children: ['Будь стильним з ФПМ!'] },
  {
    name: 'figure',
    children: [
      {
        name: '#image',
        filePath: 'rich-text-image/4811aedd-0281-4bb8-aae8-9390472aa521',
        sizes: [{ width: 1280, height: 960 }],
      },
      {
        name: 'figcaption',
        children: [
          '(Зараз розпродажі відсутні, слідкуй за цим в каналі студради)',
        ],
      },
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  {
    name: 'p',
    children: [{ name: 'strong', children: ['4. Студкуратори 👨‍👩‍👧‍👦'] }],
  },
  {
    name: 'p',
    children: [
      'Окрема організована група людей, що обирається студрадою. Це активні студенти старших курсів,  що допомагають нашим першачкам адаптуватись до навчання. Організація студентів на рівні груп та потоків на їх плечах. ',
    ],
  },
  {
    name: 'p',
    children: [
      'Дізнатись що очікувати від студкуратора можна у ',
      {
        name: 'a',
        attrs: { href: '/Gajd-na-StudKuratora-2024-07-17' },
        children: ['нашому гайді'],
      },
      '. ',
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  { name: 'p', children: [{ name: 'strong', children: ['Посилання'] }] },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'https://www.instagram.com/fam_kpi/', target: '_blank' },
        children: ['Наш інстаграм'],
      },
      ' ',
      { name: 'em', children: ['(дуже радимо підписатись!)'] },
    ],
  },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'https://t.me/abit_fam_kpi', target: '_blank' },
        children: ['Тг-канал абітурієнтів ФПМ'],
      },
      { name: 'br', attrs: { class: 'inline' } },
      {
        name: 'a',
        attrs: { href: 'https://t.me/abit_fam_chat', target: '_blank' },
        children: [
          'Чат абітурієнтів ФПМ',
          { name: 'br', attrs: { class: 'inline' } },
        ],
      },
      {
        name: 'a',
        attrs: { href: 'https://t.me/primat_kpi', target: '_blank' },
        children: ['Тг-канал студради ФПМ'],
      },
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  {
    name: 'blockquote',
    children: [
      'P.s. Ходять чутки, що якщо підписатися на ',
      {
        name: 'a',
        attrs: { href: 'https://www.instagram.com/fam_kpi/', target: '_blank' },
        children: ['інстаграм студради ФПМу'],
      },
      ', то 100% здаси зимову сесію і вийдеш на стипендію!',
      { name: 'br', attrs: { class: 'inline' } },
      {
        name: 'strong',
        children: ['(очікуйте розіграш мерчу серед підписників інстаграму)'],
      },
    ],
  },
  { name: 'hr' },
  { name: 'h3', attrs: { id: 'Профбюро-ФПМ' }, children: ['Профбюро ФПМ'] },
  {
    name: 'p',
    children: ['Профбюро ФПМ тісно повʼязано із загальним профкомом КПІ! '],
  },
  {
    name: 'p',
    children: [
      'Відповідно, наші активісти працюють на користь студентів не тільки ФПМу, а також і всього КПІ. Як це проявляється? ',
    ],
  },
  { name: 'p', children: ['Ми: '] },
  {
    name: 'ul',
    children: [
      {
        name: 'li',
        children: [
          'Займаємося волонтерством(робимо подовжувачі антен для рацій, виготовляємо окопні свічки, збираємо продуктові набори на підприємстві Food Bank, проводимо збори коштів для потреб ЗСУ і тому подібне)',
        ],
      },
      {
        name: 'li',
        children: [
          'Організовуємо вечірки. Остання з яких була доволі масштабна за участі інших профбюро. Ми зібрали понад 500 студентів та провели неймовірну тусовку в Форсажі, а також зібрали понад 40 тисяч гривень на потреби військових. ',
        ],
      },
      {
        name: 'li',
        children: [
          'Допомагаємо студентам з вирішенням спірних питань стосовно навчання та поселення в гуртожиток. ',
        ],
      },
      {
        name: 'li',
        children: [
          'Живем активне соціальне життя, адже маємо можливість долучатися до життя профбюро наших колег у Львові та приїздити до них з візитом, брати участь на самітах для студентів з активною життєвою позицією. ',
        ],
      },
    ],
  },
  {
    name: 'p',
    children: [
      'Отже! До нас може долучитися будь-який студент ФПМ КПІ, який бажає удосконалювати свої соціальні навички та проживати студентське життя на повну! ',
    ],
  },
  {
    name: 'p',
    children: [
      {
        name: 'em',
        children: [
          'Або ж просто звернутися за допомогою та гарантовано її отримати)',
        ],
      },
    ],
  },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'https://t.me/prof_stud_of_fam', target: '_blank' },
        children: ['Тг-канал профбюро ФПМ'],
      },
    ],
  },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'https://t.me/nimfajcjdj', target: '_blank' },
        children: ['Голова профбюро ФПМ'],
      },
      ' - ',
      { name: 'em', children: ['саме сюди можна звертатись за допомогою'] },
    ],
  },
  { name: 'hr' },
  {
    name: 'p',
    children: [
      'А тепер перейдемо до того, що відбувається на рівні всього університету: ',
    ],
  },
  {
    name: 'h3',
    attrs: { id: 'ЗагальноКПІшні-штуки' },
    children: ['ЗагальноКПІшні штуки'],
  },
  { name: 'p', children: [{ name: 'strong', children: ['1. Студрада КПІ '] }] },
  {
    name: 'p',
    children: [
      'Коротко кажучи, це те саме, що й студрада ФПМ (яка є незалежним підрозділом загальної студради), але вже з масштабом на весь КПІ. Відповідно вони також влаштовують івенти, допомагають студентсву та працюють на користь всього університету.',
    ],
  },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'https://t.me/sr_kpi', target: '_blank' },
        children: ['Тг-канал студради КПІ'],
      },
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  {
    name: 'p',
    children: [{ name: 'strong', children: ['2. Профком студентів КПІ'] }],
  },
  {
    name: 'p',
    children: [
      'Окрім всього того, що вже згадано у ',
      {
        name: 'a',
        attrs: {
          href: '#%D0%9F%D1%80%D0%BE%D1%84%D0%B1%D1%8E%D1%80%D0%BE-%D0%A4%D0%9F%D0%9C',
        },
        children: ['пункті щодо профбюро ФПМ'],
      },
      ', профком студентів КПІ також висвітлює важливі новини КПІ.',
      { name: 'br', attrs: { class: 'inline' } },
      'А ще, під час масових відлючень світла, часто можна прийти профком і продовжити навчання (про таку можливість зазделегідь пишуть в їх тг-каналі).',
    ],
  },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'http://t.me/pskpi', target: '_blank' },
        children: ['Тг-канал профкому КПІ'],
      },
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  {
    name: 'p',
    children: [{ name: 'strong', children: ['3. Арт-простір «Вежа»'] }],
  },
  {
    name: 'p',
    children: ['«Вежа» — це арт-простір у лівій вежі головного корпусу КПІ.'],
  },
  {
    name: 'p',
    children: [
      'Виставки картин та фотографій, літературні вечори,  квартирники, перегляд фільмів та багато іншого,  що відбувається тут з 2013 року і до сьогодення. ',
    ],
  },
  {
    name: 'p',
    children: ['В робочий час доступний гарний оглядовий майданчик 😍'],
  },
  {
    name: 'p',
    children: [
      'Зараз працюють лише під час івентів, тож слідкуйте за цим в їх ',
      {
        name: 'a',
        attrs: { href: 'https://t.me/vezhakpi', target: '_blank' },
        children: ['тг-каналі'],
      },
      '.',
    ],
  },
  {
    name: 'figure',
    children: [
      {
        name: '#image',
        filePath: 'rich-text-image/4bd593ef-a639-491d-b550-951d63bd3156',
        sizes: [{ width: 980, height: 300 }],
      },
      { name: 'figcaption' },
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  {
    name: 'p',
    children: [{ name: 'strong', children: ['4. Бібліотека + класт'] }],
  },
  {
    name: 'p',
    children: [
      'Бібліотека КПІ — це 14 000 м2 для навчання, дослідження, роботи, саморозвитку, спілкування та відпочинку. Тут є 10 читальних залів, 4 холи, студентський простір Belka, відкрита лабораторія електроніки Lampa. Простори є трьох видів (зелені, червоні, помаранчеві) — у них знайде собі місце і любитель працювати сам-на-сам у тиші, і шанувальник жвавої командної роботи. А ще по всій території бібліотеки є дуже швидкий Wi-fi!  ',
    ],
  },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'https://kpi.ua/library', target: '_blank' },
        children: ['Сайт бібліотеки'],
      },
      { name: 'br', attrs: { class: 'inline' } },
      {
        name: 'a',
        attrs: { href: 'https://t.me/kpi_library', target: '_blank' },
        children: ['Тг-канал бібліотеки'],
      },
      { name: 'br', attrs: { class: 'inline' } },
      {
        name: 'a',
        attrs: { href: 'https://t.me/events_KPILibrary', target: '_blank' },
        children: ['Тг-канал заходів бібліотеки'],
      },
      { name: 'br', attrs: { class: 'inline' } },
    ],
  },
  {
    name: 'figure',
    children: [
      {
        name: '#image',
        filePath: 'rich-text-image/b9754a97-870b-4547-8d3a-69dcb004e69a',
        sizes: [{ width: 1126, height: 750 }],
      },
      { name: 'figcaption' },
    ],
  },
  {
    name: 'p',
    children: [
      { name: 'strong', children: ['Освітній простір CLUST Space'] },
      ' – функціює в укритті бібліотеки!',
    ],
  },
  {
    name: 'p',
    children: [
      'Конференції, презентації, лекції, круглі столи, шахові турніри, майстер-класи, форуми, розмовні клуби тощо – все це в освітньому просторі CLUST Space ❤️',
    ],
  },
  {
    name: 'p',
    children: [
      'Також студенти КПІ можуть безкоштовно забронювати для себе кімнату з метою навчання, проведення зустрічі чи заходу (не розважального).',
    ],
  },
  {
    name: 'p',
    children: ['Крім цього, під час тривог простір функціонує, як укриття.'],
  },
  {
    name: 'p',
    children: [
      {
        name: 'a',
        attrs: { href: 'https://clust.team/clust-space/', target: '_blank' },
        children: ['Сайт CLUST Space'],
      },
      {
        name: 'a',
        attrs: {
          href: 'https://www.library.kpi.ua/zabronyuvaty-peregovornu-kimnatu/',
          target: '_blank',
        },
        children: [
          { name: 'br', attrs: { class: 'inline' } },
          'Забронювати окрему кімнату',
        ],
      },
    ],
  },
  {
    name: 'figure',
    children: [
      {
        name: '#image',
        filePath: 'rich-text-image/17e65266-34ad-4c8d-919f-8523adaeee82',
        sizes: [{ width: 1920, height: 1080 }],
      },
      { name: 'figcaption' },
    ],
  },
  { name: 'hr' },
  { name: 'h3', attrs: { id: 'Гуртки' }, children: ['Гуртки'] },
  {
    name: 'p',
    children: [
      { name: 'strong', children: ['1. Гуртки по всім факультетам.'] },
    ],
  },
  {
    name: 'p',
    children: [
      'Сотні гуртків наукового, інженерного та соціогуманітарного спрямування, що доступні для кожного студента:  ',
      {
        name: 'a',
        attrs: {
          href: 'https://dnvr.kpi.ua/2020/10/17/%F0%9F%93%9C-%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE-%D0%BF%D1%80%D0%BE-%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BD%D0%B5-%D0%B3%D1%83%D1%80%D1%82%D0%BA%D0%B8-%D0%BA%D0%BF%D1%96-%D1%96%D0%BC-%D1%96/',
          target: '_blank',
        },
        children: ['Посилання'],
      },
      '.',
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  {
    name: 'p',
    children: [{ name: 'strong', children: ['2. Спортивні гуртки'] }],
  },
  {
    name: 'p',
    children: [
      'В КПІ є багато спортивних секцій, про які можна почитати в ',
      {
        name: 'a',
        attrs: { href: '/FV-in-KPI-05-18' },
        children: ['офіційному гайді'],
      },
      '.',
    ],
  },
  {
    name: 'p',
    children: [
      'Також є басейн, який студенти КПІ можуть відвідувати безкоштовно, про це у ',
      {
        name: 'a',
        attrs: {
          href: '/Vse-pro-bezkoshtovne-v%D1%96dv%D1%96duvannya-basejnu-KP%D0%86-11-10',
        },
        children: ['відповідному гайді'],
      },
      '.',
    ],
  },
  {
    name: 'p',
    children: [
      'А ще недалеко від університету є скеледром - ',
      {
        name: 'a',
        attrs: { href: 'https://kpiskala.com.ua/', target: '_blank' },
        children: ['КПІ скала'],
      },
      '.',
    ],
  },
  { name: 'p', children: [{ name: 'br' }] },
  { name: 'p', children: [{ name: 'strong', children: ['3. Гуртки ЦКМ'] }] },
  {
    name: 'p',
    children: [
      'КПІшники не тільки розумні і круті, а ще й творчі! Саме тому в Центрі культури і мистецтв існують різні колективи танцю, співу та не тільки, що виступають на різних сценах Києву на України.',
    ],
  },
  {
    name: 'p',
    children: [
      'Детальніше ',
      {
        name: 'a',
        attrs: { href: 'https://kpi.ua/ckm', target: '_blank' },
        children: ['за посиланням'],
      },
    ],
  },
  { name: 'figure', children: [{ name: 'figcaption' }] },
  { name: 'figure', children: [{ name: 'figcaption' }] },
  { name: 'figure', children: [{ name: 'figcaption' }] },
  { name: 'hr' },
  { name: 'p', children: [{ name: 'br' }] },
  { name: 'p', children: [{ name: 'br' }] },
];
