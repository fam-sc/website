'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { Typography } from '@/components/Typography';
import { Checkbox } from '@/components/Checkbox';
import styles from "./index.module.scss";


export default function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    surname: '',
    name: '',
    secondName: '',
    email: '',
    phone: '',
    group: '',
    isGroupHead: false,
    password: '',
    confirmPassword: '',
    agreesToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formTitle}>
      <Typography as="strong" variant="h4">Створіть акаунт</Typography>
    </div>

      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">Прізвище</Typography>
        <TextInput
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />



        <Typography as="label" variant="bodyLarge">Ім’я</Typography>
        <TextInput
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />


        <Typography as="label" variant="bodyLarge">По батькові</Typography>
        <TextInput
          id="secondName"
          name="secondName"
          value={formData.secondName}
          onChange={handleChange}
        />
      </div>

        <div className={styles.formGroup}>
        <Typography as="label"  variant="bodyLarge">Група (АА-11)</Typography>
        <TextInput
          id="group"
          name="group"
          value={formData.group}
          onChange={handleChange}
        />

        <Checkbox
          id="isGroupHead"
          name="isGroupHead"
          checked={formData.isGroupHead}
          onChange={handleChange}
        >
          Я староста
        </Checkbox>
      </div>

        <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">Пошта</Typography>
        <TextInput
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Typography as="label"  variant="bodyLarge">Номер телефону</Typography>
        <TextInput
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

        <div className={styles.formGroup}>
        <Typography as="label"  variant="bodyLarge">Пароль</Typography>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Typography as="label" variant="bodyLarge">Підтвердіть пароль</Typography>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>


        <div className={styles.formGroup}>
        <Checkbox
          id="agreesToTerms"
          name="agreesToTerms"
          checked={formData.agreesToTerms}
          onChange={handleChange}
        >
          Даю згоду на обробку персональних даних
        </Checkbox>
      </div>

      <Button type="submit" buttonVariant="solid">Зареєструватися</Button>
    </form>
  );
}
