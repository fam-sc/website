import '@googleworkspace/drive-picker-element';

import { DrivePickerElement } from '@googleworkspace/drive-picker-element';
import { useEffect, useRef } from 'react';

import { addNativeEventListener } from '../../hooks/nativeEventListener';

export interface GoogleDrivePickerProps {
  mimeType?: string;
  onPicked?: (id: string) => void;
}

export function GoogleDrivePicker({
  mimeType,
  onPicked,
}: GoogleDrivePickerProps) {
  const ref = useRef<DrivePickerElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (element) {
      return addNativeEventListener(element, 'picker-picked', (event) => {
        const data = event.detail;

        if (data.action === 'picked') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const doc = data.docs?.at(0);

          if (doc !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onPicked?.(doc.id);
          }
        }
      });
    }
  }, [onPicked]);

  return (
    <drive-picker
      ref={ref}
      locale="uk"
      mine-only
      multiselect={false}
      prompt="select_account"
      client-id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      app-id={import.meta.env.VITE_GOOGLE_APP_ID}
    >
      <drive-picker-docs-view owned-by-me="true" mime-types={mimeType} />
    </drive-picker>
  );
}
