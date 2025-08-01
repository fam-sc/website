import { useState } from 'react';

import { TelegramBotLinker } from '@/components/TelegramBotLinker';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export default function Page() {
  const [isAuthorized, setAuthorized] = useState(false);

  return (
    <div className={styles.content}>
      {isAuthorized ? (
        <Typography>Успішно! Ви можете повернутися до бота</Typography>
      ) : (
        <TelegramBotLinker
          bot="scfamadmitbot"
          botType="admin"
          onAuthorized={() => setAuthorized(true)}
        />
      )}
    </div>
  );
}
