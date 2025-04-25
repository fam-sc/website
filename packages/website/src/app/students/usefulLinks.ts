import { UsefulLinkListItem } from '@/components/UsefulLinkList';

export const usefulLinks: UsefulLinkListItem[] = [
  {
    title: 'Деканат ФПМ',
    telegram: 'dekanat_fpm',
  },
  {
    title: 'ФПМ Чат',
    telegram: 'primat_chat',
  },
  {
    title: 'СтудРада ФПМ',
    telegram: 'primat_kpi',
  },
  {
    title: 'Чат абітурієнтів',
    telegram: 'abit_fam_chat',
  },
  {
    title: 'Студентство КПІ',
    telegram: 'sr_kpi',
  },
  {
    title: 'ДНВР',
    telegram: 'dnvr_31',
  },
].map(({ title, telegram }) => ({
  id: telegram,
  title,
  href: `https://t.me/${telegram}`,
  imageSrc: `https://media.sc-fam.org/useful-links/${telegram}`,
}));
