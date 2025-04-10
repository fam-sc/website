import { useMemo, useState } from 'react';

import { Button } from '../Button';
import { ModalDialog } from '../ModalDialog';
import { TextInput } from '../TextInput';

import styles from './index.module.scss';

import { urlRegex } from '@/utils/regex';

type Result = {
  link: string;
};

export type SelectLinkDialogProps = {
  onClose?: () => void;
  onConfirmed?: (result: Result) => void;
};

export function SelectLinkDialog(props: SelectLinkDialogProps) {
  const [link, setLink] = useState('');

  const urlPattern = useMemo(() => urlRegex(), []);
  const isValidLink = useMemo(() => urlPattern.test(link), [urlPattern, link]);

  return (
    <ModalDialog
      title="Вставка посилання"
      contentClassName={styles.content}
      footer={
        <>
          <Button onClick={props.onClose}>Відмінити</Button>
          <Button
            variant="primary"
            disabled={!isValidLink}
            onClick={() => {
              props.onConfirmed?.({ link });
              props.onClose?.();
            }}
          >
            ОК
          </Button>
        </>
      }
      onClose={props.onClose}
    >
      <TextInput
        value={link}
        isError={!isValidLink}
        onTextChanged={(newLink) => {
          setLink(newLink);
        }}
        placeholder="Посилання"
      />
    </ModalDialog>
  );
}
