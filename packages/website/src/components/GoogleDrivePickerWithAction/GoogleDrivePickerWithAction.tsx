import React, { ReactElement, useState } from 'react';

import type { GoogleDrivePickerProps } from '../GoogleDrivePicker';

export interface GoogleDrivePickerWithActionProps
  extends GoogleDrivePickerProps {
  children: ReactElement<{ onClick: () => void }>;
}

const GoogleDrivePicker = React.lazy(async () => {
  const { GoogleDrivePicker } = await import('../GoogleDrivePicker');

  return { default: GoogleDrivePicker };
});

export function GoogleDrivePickerWithAction({
  mimeType,
  onPicked,
  children,
}: GoogleDrivePickerWithActionProps) {
  const [actionFired, setActionFired] = useState(false);

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          setActionFired(true);
        },
      })}

      {actionFired && (
        <GoogleDrivePicker mimeType={mimeType} onPicked={onPicked} />
      )}
    </>
  );
}
