import { useNotification } from '@sc-fam/shared-ui';
import { ReactNode, useState } from 'react';
import { redirect } from 'react-router';

import { getSessionId } from '@/api/auth';
import { updateUserPersonalInfo } from '@/api/users/client';
import { Button } from '@/components/Button';
import { Labeled } from '@/components/Labeled';
import { TextInput } from '@/components/TextInput';
import { Title } from '@/components/Title';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return redirect('/');
  }

  const repo = repository(context);
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
