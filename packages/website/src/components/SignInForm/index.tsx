'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { Typography } from '@/components/Typography';
import { Checkbox } from '@/components/Checkbox';
import { Link } from '../Link';

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
    <form onSubmit={handleSubmit}>
      <Typography as="strong" variant="h4">З Поверненням!</Typography>

      <div>
        <Typography as="label" variant="bodyLarge">Пошта</Typography>
        <TextInput
          id="email"
          name="text"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <Typography as="label" variant="bodyLarge">Пароль</Typography>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
      <Checkbox
        id="remember"
        name="remember"
        checked={formData.remember}
        onChange={handleChange}
      >
        Запам’ятати мене
      </Checkbox>
      </div>
      
      <div >
        <Link href="https://t.me/fpm_sc_bot">Забули пароль?</Link>
      </div>

      <Button type="submit" buttonVariant="solid">Увійти</Button>
    </form>
  );
}
