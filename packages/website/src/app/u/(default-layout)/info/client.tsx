

import styles from './page.module.scss';
import { Labeled } from '@/components/Labeled';
import { ReactNode, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { useNotification } from '@/components/Notification';
import { Button } from '@/components/Button';
import { updateUserPersonalInfo } from '@/api/user/client';
import { UserPersonalInfo } from '@shared/api/user/types';

export type ClientComponentProps = {
  personalInfo: UserPersonalInfo;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Labeled title={title} titleVariant="h5">
      <div className={styles.sectionContent}>{children}</div>
    </Labeled>
  );
}

export function ClientComponent({ personalInfo }: ClientComponentProps) {
  const [firstName, setFirstName] = useState(personalInfo.firstName);
  const [lastName, setLastName] = useState(personalInfo.lastName);
  const [parentName, setParentName] = useState(personalInfo.parentName);

  const notification = useNotification();

  return (
    <div className={styles.content}>
      <title>Профіль</title>

      <div className={styles.sections}>
        <Section title="Персональна інформація">
          <TextInput
            placeholder={`Ім'я`}
            value={firstName}
            onTextChanged={setFirstName}
          />

          <TextInput
            placeholder="Прізвище"
            value={lastName}
            onTextChanged={setLastName}
          />

          <TextInput
            placeholder="По батькові"
            value={parentName ?? ''}
            onTextChanged={setParentName}
          />
        </Section>
      </div>

      <Button
        buttonVariant="outlined"
        className={styles.saveChanges}
        onClick={() => {
          updateUserPersonalInfo({ firstName, lastName, parentName })
            .then(() => {
              notification.show('Успішно оновлено', 'plain');
            })
            .catch(() => {
              notification.show('Сталася помилка', 'error');
            });
        }}
      >
        Зберегти зміни
      </Button>
    </div>
  );
}
