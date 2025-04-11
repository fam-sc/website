import { useState } from 'react';

import { IconButton } from '../IconButton';
import { TextInput, TextInputProps } from '../TextInput';

import styles from './index.module.scss';

import { SeePasswordIcon } from '@/icons/SeePasswordIcon';

interface PasswordInputProps
  extends Omit<TextInputProps, 'endContent' | 'type'> {
  autocomplete?: 'current-password' | 'new-password';
}

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      {...props}
      type={showPassword ? 'text' : 'password'}
      endContent={
        <IconButton
          onClick={() => {
            setShowPassword((state) => !state);
          }}
          className={styles['show-password-button']}
          rounding="circle"
        >
          <SeePasswordIcon active={showPassword} />
        </IconButton>
      }
      onTextChanged={(text) => {
        setShowPassword(false);
        props.onTextChanged?.(text);
      }}
    />
  );
}
