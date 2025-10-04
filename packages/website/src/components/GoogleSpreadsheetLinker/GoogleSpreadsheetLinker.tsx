import { IconButton } from '@sc-fam/shared-ui';

import { EditIcon } from '@/icons/EditIcon';
import { GoogleSpreadsheetIcon } from '@/icons/GoogleSpreadsheetIcon';
import { classNames } from '@/utils/classNames';

import { Button } from '../Button';
import { GoogleDrivePickerWithAction } from '../GoogleDrivePickerWithAction';
import { Link } from '../Link';
import styles from './GoogleSpreadsheetLinker.module.scss';

export interface GoogleSpreadsheetLinkerProps {
  className?: string;
  spreadsheet?: {
    name: string;
    link: string;
  };
  actionTitle: string;
  onSpreadsheetLinked?: (id: string) => void;
}

const MIME_TYPE = 'application/vnd.google-apps.spreadsheet';

export function GoogleSpreadsheetLinker({
  className,
  spreadsheet,
  actionTitle,
  onSpreadsheetLinked,
}: GoogleSpreadsheetLinkerProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {spreadsheet === undefined ? (
        <GoogleDrivePickerWithAction
          mimeType={MIME_TYPE}
          onPicked={onSpreadsheetLinked}
        >
          <Button>{actionTitle}</Button>
        </GoogleDrivePickerWithAction>
      ) : (
        <div className={styles['info-container']}>
          <Link className={styles.info} to={spreadsheet.link} variant="body">
            <GoogleSpreadsheetIcon />
            {spreadsheet.name}
          </Link>

          <GoogleDrivePickerWithAction
            mimeType={MIME_TYPE}
            onPicked={onSpreadsheetLinked}
          >
            <IconButton title="Змінити файл" hover="fill">
              <EditIcon />
            </IconButton>
          </GoogleDrivePickerWithAction>
        </div>
      )}
    </div>
  );
}
