'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { Typography } from '@/components/Typography';
import { Checkbox } from '@/components/Checkbox';
import { Link } from '../Link';
import styles from './index.module.scss';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.signinForm}>
        <div className={styles.formTitle}>
      <Typography as="strong" variant="h4" className="formTitle">
        З Поверненням!
      </Typography>
        </div>
      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">Пошта</Typography>
        <TextInput
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

        <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">Пароль</Typography>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

        <div className={styles.formGroup}>
        <Checkbox
          id="remember"
          name="remember"
          checked={formData.remember}
          onChange={handleChange}
        >
          Запам’ятати мене
        </Checkbox>
      </div>

        <div className={styles.formGroup}>
        <Link href="https://t.me/fpm_sc_bot">Забули пароль?</Link>
      </div>

        <div className={styles.formGroup}>
        <Button type="submit" buttonVariant="solid">Увійти</Button>
      </div>
    </form>
  );
}
