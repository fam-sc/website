import { useState } from 'react';

import { IconButton } from '../IconButton';
import { TextInput, TextInputProps } from '../TextInput';

import styles from './index.module.scss';

import { SeePasswordIcon } from '@/icons/SeePasswordIcon';
import { classNames } from '@/utils/classNames';

interface PasswordInputProps
  extends Omit<TextInputProps, 'endContent' | 'type'> {
  autoComplete?: 'current-password' | 'new-password';
}

export function PasswordInput({
  className,
  onTextChanged,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      {...rest}
      className={classNames(className, styles.root)}
      type={showPassword ? 'text' : 'password'}
      endContent={
        <IconButton
          onClick={() => {
            setShowPassword((state) => !state);
          }}
          className={styles['show-password-button']}
          title={showPassword ? 'Приховати пароль' : 'Показати пароль'}
          rounding="circle"
        >
          <SeePasswordIcon active={showPassword} />
        </IconButton>
      }
      onTextChanged={(text) => {
        setShowPassword(false);
        onTextChanged?.(text);
      }}
    />
  );
}
