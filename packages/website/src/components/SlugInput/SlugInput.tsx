import { isValidSlug, textToSlug } from '@sc-fam/shared';
import { useCallback, useEffect, useState } from 'react';

import { MagicWandIcon } from '@/icons/MagicWandIcon';

import { IconButton } from '@sc-fam/shared-ui';
import { TextInput, TextInputVariant } from '../TextInput';
import styles from './SlugInput.module.scss';

export interface SlugInputProps {
  disabled?: boolean;
  className?: string;
  error?: string | boolean;
  variant?: TextInputVariant;
  slugContent: string;
  autoUpdateSlug?: boolean;
  slug: string;
  onSlugChanged?: (slug: string) => void;
}

export function SlugInput({
  disabled,
  className,
  error,
  variant,
  slugContent,
  autoUpdateSlug = true,
  slug,
  onSlugChanged,
}: SlugInputProps) {
  const [autoChange, setAutoChange] = useState(true);

  const onGenerateSlug = useCallback(() => {
    const newSlug = textToSlug(slugContent);

    onSlugChanged?.(newSlug);
  }, [slugContent, onSlugChanged]);

  const onTextChanged = useCallback(
    (text: string) => {
      if (text.length === 0 || isValidSlug(text)) {
        setAutoChange(false);
        onSlugChanged?.(text);
      }
    },
    [onSlugChanged]
  );

  useEffect(() => {
    if (autoChange && autoUpdateSlug) {
      onGenerateSlug();
    }
  }, [autoChange, autoUpdateSlug, onGenerateSlug]);

  return (
    <div className={styles.root}>
      <TextInput
        disabled={disabled}
        className={className}
        error={error}
        variant={variant}
        value={slug}
        onTextChanged={onTextChanged}
      />

      <IconButton
        disabled={disabled}
        className={styles.generate}
        title="Згенерувати користуватський ID"
        onClick={onGenerateSlug}
      >
        <MagicWandIcon />
      </IconButton>
    </div>
  );
}
