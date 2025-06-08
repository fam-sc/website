import { useState } from 'react';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { Typography } from '@/components/Typography';
import { Link } from '../Link';
import styles from './index.module.scss';
import { signIn } from '@/api/user/client';
import { useNotification } from '../Notification';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const notification = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signIn({ email: formData.email, password: formData.password })
      .then(() => {
        // Don't use client navigation, because the auth status changed and
        // we need to refresh the root layout
        globalThis.location.href = '/u/info';
      })
      .catch(() => {
        notification.show('Неправильний email або пароль', 'error');
      });
  };

  return (
    <div className={styles.signinForm}>
      <div className={styles.formTitle}>
        <Typography as="strong" variant="h4" className="formTitle">
          З Поверненням!
        </Typography>
      </div>
      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Пошта
        </Typography>
        <TextInput
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Пароль
        </Typography>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <Link to="https://t.me/fpm_sc_bot">Забули пароль?</Link>
      </div>

      <div className={styles.formGroup}>
        <Button onClick={handleSubmit} buttonVariant="solid">
          Увійти
        </Button>
      </div>
    </div>
  );
}
