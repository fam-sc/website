import { normalizeGuid } from '@shared/guid';
import { emailRegex, telnumRegex } from '@shared/string/regex';
import { useCallback, useState } from 'react';
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
import { useNotification } from '../Notification';
import { TurnstileWidget } from '../TurnstileWidget';
import styles from './index.module.scss';

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
    <div className={styles.signupForm}>
      <div className={styles.formTitle}>
        <Typography as="strong" variant="h4">
          Створіть акаунт
        </Typography>
      </div>

      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Прізвище
        </Typography>
        <TextInput
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

        <Typography as="label" variant="bodyLarge">
          Ім’я
        </Typography>
        <TextInput
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />

        <Typography as="label" variant="bodyLarge">
          По батькові
        </Typography>
        <TextInput
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Група (АА-11)
        </Typography>

        <GroupSelect
          selectedId={group}
          onSelected={useCallback((group) => {
            setGroup(group.campusId);
          }, [])}
        />
      </div>

      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Пошта
        </Typography>
        <TextInput
          name="email"
          type="email"
          error={!isValidEmail}
          value={formData.email}
          onChange={handleChange}
        />

        <Typography as="label" variant="bodyLarge">
          Номер телефону
        </Typography>
        <TextInput
          name="phone"
          type="tel"
          error={!isValidPhone}
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Пароль
        </Typography>
        <PasswordInput
          name="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />

        <Typography as="label" variant="bodyLarge">
          Підтвердіть пароль
        </Typography>
        <PasswordInput
          name="confirmPassword"
          autoComplete="current-password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <Checkbox checked={agreeToTerms} onCheckedChanged={setAgreeToTerms}>
          Даю згоду на обробку персональних даних
        </Checkbox>
      </div>

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
