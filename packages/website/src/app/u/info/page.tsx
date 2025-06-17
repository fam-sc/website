import { redirect } from 'react-router';
import { Route } from './+types/page';
import { getSessionIdNumber } from '@/api/auth';
import { Repository } from '@data/repo';
import { Labeled } from '@/components/Labeled';
import { ReactNode, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { useNotification } from '@/components/Notification';
import { Button } from '@/components/Button';
import { updateUserPersonalInfo } from '@/api/users/client';
import { Title } from '@/components/Title';
import styles from './page.module.scss';

export async function loader({ request }: Route.LoaderArgs) {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return redirect('/');
  }

  await using repo = await Repository.openConnection();
  const personalInfo = await repo.sessions().getUserPersonalInfo(sessionId);
  if (personalInfo === null) {
    return redirect('/');
  }

  return { personalInfo };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Labeled title={title} titleVariant="h5">
      <div className={styles.sectionContent}>{children}</div>
    </Labeled>
  );
}

export default function Page({
  loaderData: { personalInfo },
}: Route.ComponentProps) {
  const [firstName, setFirstName] = useState(personalInfo.firstName);
  const [lastName, setLastName] = useState(personalInfo.lastName);
  const [parentName, setParentName] = useState(personalInfo.parentName);

  const notification = useNotification();

  return (
    <div className={styles.content}>
      <Title>Профіль</Title>

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
