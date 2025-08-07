import { UsefulLinkListItem } from '@/components/UsefulLinkList';
import abitFamChat from '@/images/usefulLinks/abit_fam_chat.jpg?multiple';
import dekanatFpm from '@/images/usefulLinks/dekanat_fpm.jpg?multiple';
import dnvr31 from '@/images/usefulLinks/dnvr_31.jpg?multiple';
import primatChat from '@/images/usefulLinks/primat_chat.jpg?multiple';
import primatKpi from '@/images/usefulLinks/primat_kpi.jpg?multiple';
import srKpi from '@/images/usefulLinks/sr_kpi.jpg?multiple';

export const usefulLinks: UsefulLinkListItem[] = [
  {
    title: 'Деканат ФПМ',
    telegram: 'dekanat_fpm',
    images: dekanatFpm,
  },
  {
    title: 'ФПМ Чат',
    telegram: 'primat_chat',
    images: primatChat,
  },
  {
    title: 'СтудРада ФПМ',
    telegram: 'primat_kpi',
    images: primatKpi,
  },
  {
    title: 'Чат абітурієнтів',
    telegram: 'abit_fam_chat',
    images: abitFamChat,
  },
  {
    title: 'Студентство КПІ',
    telegram: 'sr_kpi',
    images: srKpi,
  },
  {
    title: 'ДНВР',
    telegram: 'dnvr_31',
    images: dnvr31,
  },
].map(({ title, telegram, images }) => ({
  id: telegram,
  title,
  images,
  href: `https://t.me/${telegram}`,
}));
