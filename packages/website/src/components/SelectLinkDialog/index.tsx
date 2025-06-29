import { urlRegex } from '@shared/string/regex';
import { useMemo, useState } from 'react';

import { Button } from '../Button';
import { ModalDialog } from '../ModalDialog';
import { TextInput } from '../TextInput';
import styles from './index.module.scss';

type Result = {
  link: string;
};

export type SelectLinkDialogProps = {
  onClose?: () => void;
  onConfirmed?: (result: Result) => void;
};

export function SelectLinkDialog(props: SelectLinkDialogProps) {
  const [link, setLink] = useState('');

  const isValidLink = useMemo(() => urlRegex.test(link), [link]);

  return (
    <ModalDialog
      title="Вставка посилання"
      contentClassName={styles.content}
      footer={
        <>
          <Button onClick={props.onClose}>Відмінити</Button>
          <Button
            buttonVariant="solid"
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
        error={!isValidLink && 'Неправильний формат посилання'}
        onTextChanged={setLink}
        placeholder="Посилання"
      />
    </ModalDialog>
  );
}
