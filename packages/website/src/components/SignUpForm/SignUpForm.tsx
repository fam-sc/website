import { normalizeGuid } from '@sc-fam/shared';
import { emailRegex, telnumRegex } from '@sc-fam/shared/string';
import { ReactNode, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { SignUpData } from '@/api/auth/types';
import { signUp } from '@/api/users/client';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInput } from '@/components/TextInput';
import { Typography } from '@/components/Typography';
import { useTestRegex } from '@/hooks/useTestRegex';
import { useTurnstile } from '@/hooks/useTurnstile';
import { pick } from '@/utils/object/pick';

import { ErrorBoard } from '../ErrorBoard';
import { GroupSelect } from '../GroupSelect';
import { Labeled } from '../Labeled';
import { useNotification } from '../Notification';
import { TurnstileWidget } from '../TurnstileWidget';
import styles from './SignUpForm.module.scss';

function FieldBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Labeled
      title={title}
      titleVariant="bodyLarge"
      className={styles['input-group']}
    >
      {children}
    </Labeled>
  );
}

export function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    parentName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [group, setGroup] = useState<string>();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [turnstileToken, refreshTurnstile, turnstile] = useTurnstile();

  const [actionInProgress, setActionInProgress] = useState(false);

  const redirect = useNavigate();
  const notification = useNotification();

  const isValidEmail = useTestRegex(formData.email, emailRegex);
  const isValidPhone = useTestRegex(formData.phone, telnumRegex);

  const canSubmit =
    isValidEmail &&
    isValidPhone &&
    group !== undefined &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    agreeToTerms;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const payload: SignUpData = {
      ...pick(formData, [
        'firstName',
        'lastName',
        'parentName',
        'email',
        'password',
      ]),
      telnum: formData.phone,
      academicGroup: normalizeGuid(group as string),
      turnstileToken,
    };

    setActionInProgress(true);
    signUp(payload)
      .then(() => {
        return redirect('/signup/email');
      })
      .catch(() => {
        setActionInProgress(false);
        refreshTurnstile();

        notification.show('Сталася помилка', 'error');
      });
  };

  return (
    <div className={styles.root}>
      <Typography as="strong" variant="h4">
        Створіть акаунт
      </Typography>

      <FieldBlock title="Прізвище">
        <TextInput
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </FieldBlock>

      <FieldBlock title="Ім’я">
        <TextInput
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </FieldBlock>

      <FieldBlock title="По батькові">
        <TextInput
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
        />
      </FieldBlock>

      <FieldBlock title="Група (АА-11)">
        <GroupSelect
          selectedId={group}
          onSelected={useCallback((group) => {
            setGroup(group.campusId);
          }, [])}
        />
      </FieldBlock>

      <FieldBlock title="Пошта">
        <TextInput
          name="email"
          type="email"
          error={!isValidEmail}
          value={formData.email}
          onChange={handleChange}
        />
      </FieldBlock>

      <FieldBlock title="Номер телефону">
        <TextInput
          name="phone"
          type="tel"
          error={!isValidPhone}
          value={formData.phone}
          onChange={handleChange}
        />
      </FieldBlock>

      <FieldBlock title="Пароль">
        <PasswordInput
          name="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
      </FieldBlock>

      <FieldBlock title="Підтвердіть пароль">
        <PasswordInput
          name="confirmPassword"
          autoComplete="current-password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </FieldBlock>

      <Checkbox checked={agreeToTerms} onCheckedChanged={setAgreeToTerms}>
        Даю згоду на обробку персональних даних
      </Checkbox>

      {import.meta.env.VITE_HOST === 'cf' && (
        <TurnstileWidget
          className={styles['turnstile-widget']}
          {...turnstile}
        />
      )}

      <ErrorBoard
        items={[
          !isValidEmail && 'Неправильний email',
          !isValidPhone && 'Неправильний телефон',
          group === undefined && 'Виберіть групу',
          formData.password.length < 8 &&
            'Пароль має бути як мінімум 8 символів',
          formData.password !== formData.confirmPassword &&
            'Паролі не співпадають',
        ]}
      />

      <Button
        buttonVariant="solid"
        disabled={
          !canSubmit ||
          actionInProgress ||
          (import.meta.env.VITE_HOST === 'cf' && turnstileToken === null)
        }
        onClick={handleSubmit}
      >
        Зареєструватися
      </Button>
    </div>
  );
}
