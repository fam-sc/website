'use client';

import { usefulLinks } from './usefulLinks';

import styles from './page.module.scss';

import { Typography } from '@/components/Typography';
import {
  UsefulLinkList,
} from '@/components/UsefulLinkList';


export function ClientComponent() {
  return (
    <>
      <Typography variant="h4" className={styles['useful-links-title']}>
        Корисні джерела
      </Typography>
      <UsefulLinkList className={styles['useful-links']} items={usefulLinks} />
    </>
  );
}
